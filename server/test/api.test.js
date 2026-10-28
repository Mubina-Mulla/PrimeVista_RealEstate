import test from 'node:test'
import assert from 'node:assert/strict'

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5001/api'

// Helper for HTTP JSON requests
async function apiRequest(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  const response = await fetch(url, {
    ...options,
    headers,
  })
  const text = await response.text()
  let body = null
  try {
    body = JSON.parse(text)
  } catch {
    body = text
  }
  return { status: response.status, body }
}

test('PrimeVista API & Security Test Suite', async (t) => {
  let superAdminToken = ''
  let agentToken = ''

  await t.test('1. Health Check Endpoint', async () => {
    const res = await apiRequest('/health')
    assert.equal(res.status, 200, 'Health endpoint must respond with 200')
    assert.equal(res.body.success, true, 'Success should be true')
    assert.equal(res.body.database, 'connected', 'Database should be connected')
  })

  await t.test('2. Public Property Search excludes Draft & Archived listings', async () => {
    const res = await apiRequest('/properties?limit=50')
    assert.equal(res.status, 200)
    assert.equal(res.body.success, true)
    assert.ok(Array.isArray(res.body.data), 'Data should be an array')

    const hasDraft = res.body.data.some((p) => p.status === 'draft')
    const hasArchived = res.body.data.some((p) => p.status === 'archived')
    assert.equal(hasDraft, false, 'Public search MUST NOT return draft properties')
    assert.equal(hasArchived, false, 'Public search MUST NOT return archived properties')

    const azureDraft = res.body.data.find(
      (p) => p.slug === 'the-azure-crest-seafront-4bhk-duplex'
    )
    assert.equal(azureDraft, undefined, 'Draft property PV-109 must not appear in search')
  })

  await t.test('3. Public Property Detail strictly blocks Draft listings', async () => {
    const res = await apiRequest('/properties/detail/the-azure-crest-seafront-4bhk-duplex')
    assert.equal(
      res.status,
      404,
      'Requesting draft property via public slug should return 404 Not Found'
    )
    assert.equal(res.body.success, false)
  })

  await t.test('4. Public Property Detail returns published property correctly', async () => {
    const res = await apiRequest('/properties/detail/the-palm-heights-ultra-luxury-4bhk-penthouse')
    assert.equal(res.status, 200)
    assert.equal(res.body.success, true)
    assert.equal(res.body.data.propertyId, 'PV-101')
    assert.equal(res.body.data.status, 'published')
  })

  await t.test('5. Authentication Security: Reject invalid password', async () => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@primevista.com',
        password: 'IncorrectPassword999',
      }),
    })
    assert.equal(res.status, 401, 'Invalid password must return 401 Unauthorized')
    assert.equal(res.body.success, false)
  })

  await t.test('6. Authentication: Login Super Admin and receive valid JWT', async () => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@primevista.com',
        password: 'Password@123',
      }),
    })
    assert.equal(res.status, 200)
    assert.equal(res.body.success, true)
    assert.ok(res.body.token, 'Token should be returned')
    assert.equal(res.body.user.role, 'super_admin')
    superAdminToken = res.body.token
  })

  await t.test('7. Authentication: Login Agent user and receive JWT', async () => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'agent@primevista.com',
        password: 'Password@123',
      }),
    })
    assert.equal(res.status, 200)
    assert.equal(res.body.success, true)
    assert.ok(res.body.token, 'Token should be returned')
    assert.equal(res.body.user.role, 'agent')
    agentToken = res.body.token
  })

  await t.test('8. RBAC: Unauthenticated access to dashboard stats returns 401', async () => {
    const res = await apiRequest('/dashboard/stats')
    assert.equal(res.status, 401, 'Unauthenticated access must return 401')
  })

  await t.test('9. RBAC: Super Admin can access user management', async () => {
    const res = await apiRequest('/auth/users', {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    })
    assert.equal(res.status, 200)
    assert.equal(res.body.success, true)
    const userList = res.body.data || res.body.users
    assert.ok(Array.isArray(userList), 'User list should be returned')
    assert.ok(userList.length > 0, 'Users should not be empty')
  })

  await t.test('10. RBAC: Agent CANNOT access user management (Forbidden 403)', async () => {
    const res = await apiRequest('/auth/users', {
      headers: { Authorization: `Bearer ${agentToken}` },
    })
    assert.equal(res.status, 403, 'Agent accessing user management must be blocked with 403')
  })

  await t.test('11. Inquiry Validation: Rejects missing required customer fields', async () => {
    const res = await apiRequest('/inquiries', {
      method: 'POST',
      body: JSON.stringify({
        customerName: 'Test Inquirer',
        // Missing email & phone
        message: 'Hello, I want details',
      }),
    })
    assert.equal(res.status, 400, 'Missing email/phone must return 400 Validation Error')
    assert.equal(res.body.success, false)
  })

  await t.test('12. Inquiry Submission: Valid inquiry creates record in MongoDB', async () => {
    const res = await apiRequest('/inquiries', {
      method: 'POST',
      body: JSON.stringify({
        customerName: 'Ananya Deshmukh',
        email: 'ananya.test@example.com',
        phone: '+91 98765 43210',
        message: 'Interested in booking a weekend site visit for the 3BHK villa.',
        preferredDate: '2026-11-15',
        preferredTime: '11:00 AM',
      }),
    })
    assert.equal(res.status, 201)
    assert.equal(res.body.success, true)
    const id = res.body.inquiryId || res.body.data?._id
    assert.ok(id, 'Created inquiry should have an ID')
  })

  await t.test('13. Inquiry Access Control: Agent only sees assigned inquiries', async () => {
    const res = await apiRequest('/inquiries', {
      headers: { Authorization: `Bearer ${agentToken}` },
    })
    assert.equal(res.status, 200)
    assert.equal(res.body.success, true)
    assert.ok(Array.isArray(res.body.data))
    res.body.data.forEach((inq) => {
      assert.ok(
        inq.assignedAgent,
        'Inquiries shown to agent must be assigned to an agent profile'
      )
    })
  })

  await t.test('14. Public CMS Pages: About Us content returns published version', async () => {
    const res = await apiRequest('/content/about')
    assert.equal(res.status, 200)
    assert.equal(res.body.success, true)
    assert.equal(res.body.data.pageKey, 'about')
    assert.ok(res.body.data.sections.headline, 'About page should have headline')
  })
})
