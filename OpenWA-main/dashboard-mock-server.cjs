const http = require('http');

const PORT = 2785;

// In-memory demo data
const sessions = [
  {
    id: 'session-demo-1',
    name: 'Customer Support (+91 98765 43210)',
    status: 'ready',
    engineLoaded: true,
    phone: '919876543210',
    pushName: 'OpenWA Support',
    connectedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    lastActive: new Date().toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'session-demo-2',
    name: 'Sales Bot (Automated)',
    status: 'ready',
    engineLoaded: true,
    phone: '919812345678',
    pushName: 'OpenWA Sales Assistant',
    connectedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    lastActive: new Date().toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'session-demo-3',
    name: 'Marketing Updates',
    status: 'qr_ready',
    engineLoaded: false,
    phone: null,
    pushName: null,
    connectedAt: null,
    lastActive: null,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const chats = [
  {
    id: '919988776655@c.us',
    name: 'Rahul Sharma',
    isGroup: false,
    kind: 'individual',
    unreadCount: 2,
    timestamp: Math.floor(Date.now() / 1000) - 120,
    lastMessage: 'Hi, I wanted to know the pricing for the enterprise tier.',
    lastMessageType: 'text',
    archived: false,
    pinned: true,
  },
  {
    id: '918877665544@c.us',
    name: 'Priya Patel',
    isGroup: false,
    kind: 'individual',
    unreadCount: 0,
    timestamp: Math.floor(Date.now() / 1000) - 3600,
    lastMessage: 'Thank you for the quick resolution!',
    lastMessageType: 'text',
    archived: false,
    pinned: false,
  },
  {
    id: '120363024829384920@g.us',
    name: 'Product Announcements & VIPs',
    isGroup: true,
    kind: 'group',
    unreadCount: 5,
    timestamp: Math.floor(Date.now() / 1000) - 600,
    lastMessage: 'Version 2.0 release candidate is live now!',
    lastMessageType: 'text',
    archived: false,
    pinned: true,
  }
];

const messages = [
  {
    id: 'msg-01',
    timestamp: Math.floor(Date.now() / 1000) - 600,
    from: '919988776655@c.us',
    to: '919876543210@c.us',
    body: 'Hello! Is this the official OpenWA support?',
    fromMe: false,
    type: 'text',
    status: 'read',
    isGroup: false,
    kind: 'individual',
    contact: { name: 'Rahul Sharma', number: '919988776655' }
  },
  {
    id: 'msg-02',
    timestamp: Math.floor(Date.now() / 1000) - 450,
    from: '919876543210@c.us',
    to: '919988776655@c.us',
    body: 'Yes, welcome! How can we assist you today?',
    fromMe: true,
    type: 'text',
    status: 'read',
    isGroup: false,
    kind: 'individual'
  },
  {
    id: 'msg-03',
    timestamp: Math.floor(Date.now() / 1000) - 120,
    from: '919988776655@c.us',
    to: '919876543210@c.us',
    body: 'Hi, I wanted to know the pricing for the enterprise tier.',
    fromMe: false,
    type: 'text',
    status: 'delivered',
    isGroup: false,
    kind: 'individual',
    contact: { name: 'Rahul Sharma', number: '919988776655' }
  }
];

const webhooks = [
  {
    id: 'wh-1',
    sessionId: 'session-demo-1',
    url: 'https://webhook.site/demo-openwa-endpoint',
    events: ['message.received', 'message.ack', 'session.status'],
    active: true,
    retryCount: 0,
    lastTriggeredAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const apiKeys = [
  {
    id: 'key-1',
    name: 'Admin Master Key (Demo)',
    keyPrefix: 'openwa_adm_test',
    role: 'admin',
    isActive: true,
    usageCount: 142,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    lastUsedAt: new Date().toISOString(),
  },
  {
    id: 'key-2',
    name: 'Support Operator Key',
    keyPrefix: 'openwa_opr_test',
    role: 'operator',
    allowedSessions: ['session-demo-1'],
    isActive: true,
    usageCount: 56,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    lastUsedAt: new Date().toISOString(),
  }
];

const templates = [
  {
    id: 'tpl-1',
    sessionId: 'session-demo-1',
    name: 'Order Confirmation',
    header: 'Order Update',
    body: 'Hi {{name}}, your order #{{order_id}} has been confirmed and is being processed!',
    footer: 'Team OpenWA',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tpl-2',
    sessionId: 'session-demo-1',
    name: 'OTP Verification',
    header: 'Security Alert',
    body: 'Your verification OTP is {{otp}}. Valid for 5 minutes. Do not share this with anyone.',
    footer: 'OpenWA Auth',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const auditLogs = [
  {
    id: 'audit-1',
    action: 'auth.login.success',
    severity: 'info',
    apiKeyId: 'key-1',
    apiKeyName: 'Admin Master Key (Demo)',
    sessionId: null,
    sessionName: null,
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    method: 'POST',
    path: '/api/auth/validate',
    statusCode: 200,
    errorMessage: null,
    metadata: { demo: true },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'audit-2',
    action: 'message.send',
    severity: 'info',
    apiKeyId: 'key-1',
    apiKeyName: 'Admin Master Key (Demo)',
    sessionId: 'session-demo-1',
    sessionName: 'Customer Support',
    ipAddress: '127.0.0.1',
    userAgent: 'OpenWA Dashboard',
    method: 'POST',
    path: '/api/sessions/session-demo-1/messages/send-text',
    statusCode: 200,
    errorMessage: null,
    metadata: { to: '919988776655@c.us' },
    createdAt: new Date(Date.now() - 450000).toISOString(),
  }
];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
    });
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost:2785'}`);
  const pathname = url.pathname;

  // Read body if POST/PUT/PATCH
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    let parsedBody = {};
    if (body) {
      try { parsedBody = JSON.parse(body); } catch (_) {}
    }

    // 1. Auth Validation (Accept ANY key or demo key)
    if (pathname === '/api/auth/validate' || pathname === '/auth/validate') {
      return sendJson(res, 200, {
        valid: true,
        role: 'admin',
        engineType: 'baileys',
        scoped: false,
      });
    }

    // 2. Health & System
    if (pathname === '/api/health/ready' || pathname === '/health/ready' || pathname === '/api/health') {
      return sendJson(res, 200, {
        status: 'ok',
        version: '0.24.0',
        details: {
          database: { status: 'up' },
          redis: { status: 'up' },
          queue: { status: 'up' }
        }
      });
    }

    // 3. Infrastructure
    if (pathname === '/api/infra/status' || pathname === '/infra/status') {
      return sendJson(res, 200, {
        database: { connected: true, type: 'sqlite', host: 'localhost:built-in', builtIn: true },
        redis: { enabled: true, connected: true, host: 'localhost', port: 6379, builtIn: true },
        queue: { enabled: true, webhooks: { pending: 0, completed: 142, failed: 1 } },
        storage: { type: 'local', path: './data/media', builtIn: true, s3Available: false },
        engine: { type: 'baileys', headless: true },
        envPinned: []
      });
    }

    if (pathname === '/api/infra/update-check' || pathname === '/infra/update-check') {
      return sendJson(res, 200, {
        current: '0.24.0',
        latest: '0.24.0',
        updateAvailable: false,
        releaseUrl: null,
      });
    }

    // 4. Session Stats Overview
    if (pathname === '/api/sessions/stats/overview') {
      return sendJson(res, 200, {
        total: sessions.length,
        active: 2,
        ready: 2,
        disconnected: 1,
        byStatus: { ready: 2, qr_ready: 1 },
        memoryUsage: { heapUsed: 52000000, heapTotal: 96000000, rss: 140000000 }
      });
    }

    // 4b. Global Stats Overview (For Dashboard cards)
    if (pathname === '/api/stats/overview' || pathname === '/stats/overview') {
      return sendJson(res, 200, {
        sessions: {
          active: 2,
          total: sessions.length,
          byStatus: { ready: 2, qr_ready: 1 }
        },
        messages: {
          sent: 450,
          received: 890,
          failed: 2,
          today: {
            sent: 48,
            received: 92
          }
        }
      });
    }

    // 4c. Message Stats & Chart Series
    if (pathname === '/api/stats/messages' || pathname === '/stats/messages') {
      const now = Date.now();
      return sendJson(res, 200, {
        timeSeries: [
          { timestamp: new Date(now - 3600000 * 18).toISOString(), sent: 12, received: 25 },
          { timestamp: new Date(now - 3600000 * 12).toISOString(), sent: 18, received: 34 },
          { timestamp: new Date(now - 3600000 * 6).toISOString(), sent: 30, received: 55 },
          { timestamp: new Date(now).toISOString(), sent: 22, received: 41 }
        ],
        byType: {
          text: 1100,
          image: 150,
          document: 45,
          audio: 20
        },
        bySession: [
          { sessionId: 'session-demo-1', name: 'Customer Support (+91 98765 43210)', sent: 320, received: 620 },
          { sessionId: 'session-demo-2', name: 'Sales Bot (Automated)', sent: 130, received: 270 }
        ],
        topChats: [
          { chatId: '919988776655@c.us', chatName: 'Rahul Sharma', messageCount: 18 },
          { chatId: '120363024829384920@g.us', chatName: 'Product Announcements & VIPs', messageCount: 42 },
          { chatId: '918877665544@c.us', chatName: 'Priya Patel', messageCount: 8 }
        ]
      });
    }

    // 5. Sessions list and CRUD
    if (pathname === '/api/sessions' && req.method === 'GET') {
      return sendJson(res, 200, sessions);
    }
    if (pathname === '/api/sessions' && req.method === 'POST') {
      const newSession = {
        id: 'session-' + Date.now(),
        name: parsedBody.name || 'New Session',
        status: 'qr_ready',
        engineLoaded: true,
        phone: null,
        pushName: null,
        connectedAt: null,
        lastActive: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      sessions.push(newSession);
      return sendJson(res, 201, newSession);
    }

    // 6. Specific Session Routes
    const sessionMatch = pathname.match(/^\/api\/sessions\/([^/]+)(\/.*)?$/);
    if (sessionMatch) {
      const sessionId = sessionMatch[1];
      const subpath = sessionMatch[2] || '';
      const session = sessions.find(s => s.id === sessionId) || sessions[0];

      if (subpath === '' && req.method === 'GET') {
        return sendJson(res, 200, session);
      }
      if (subpath === '/config' && req.method === 'GET') {
        return sendJson(res, 200, { autoRejectCalls: false, maxReconnectAttempts: null, reconnectBaseDelay: 3000 });
      }
      if (subpath === '/proxy' && req.method === 'GET') {
        return sendJson(res, 200, { enabled: false, proxyType: null, proxyHost: null, hasCredentials: false });
      }
      if (subpath === '/qr' && req.method === 'GET') {
        return sendJson(res, 200, {
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
          status: 'qr_ready'
        });
      }
      if (subpath === '/chats' && req.method === 'GET') {
        return sendJson(res, 200, chats);
      }
      if (subpath === '/messages' && req.method === 'GET') {
        return sendJson(res, 200, { messages, total: messages.length });
      }
      if (subpath.startsWith('/messages/') && subpath.endsWith('/history') && req.method === 'GET') {
        return sendJson(res, 200, messages);
      }
      if (subpath.startsWith('/messages/send-')) {
        const newMsg = {
          id: 'msg-' + Date.now(),
          timestamp: Math.floor(Date.now() / 1000),
          from: session.phone ? `${session.phone}@c.us` : 'me@c.us',
          to: parsedBody.chatId || '919988776655@c.us',
          body: parsedBody.text || 'Sample Message',
          fromMe: true,
          type: 'text',
          status: 'sent',
          isGroup: false,
          kind: 'individual'
        };
        messages.push(newMsg);
        return sendJson(res, 200, { messageId: newMsg.id, timestamp: newMsg.timestamp });
      }
      if (subpath === '/channels' && req.method === 'GET') {
        return sendJson(res, 200, []);
      }
      if (subpath === '/status' && req.method === 'GET') {
        return sendJson(res, 200, { statuses: [] });
      }
      if (subpath === '/contacts' && req.method === 'GET') {
        return sendJson(res, 200, [
          { id: '919988776655@c.us', name: 'Rahul Sharma', number: '919988776655', isMyContact: true, isBlocked: false },
          { id: '918877665544@c.us', name: 'Priya Patel', number: '918877665544', isMyContact: true, isBlocked: false }
        ]);
      }
      if (subpath === '/contacts/profile-pictures') {
        return sendJson(res, 200, { pictures: {} });
      }
      if (subpath === '/webhooks' && req.method === 'GET') {
        return sendJson(res, 200, webhooks.filter(w => w.sessionId === sessionId));
      }
      if (subpath === '/templates' && req.method === 'GET') {
        return sendJson(res, 200, templates.filter(t => t.sessionId === sessionId));
      }
      if (subpath === '/start' || subpath === '/stop' || subpath === '/logout') {
        session.status = subpath === '/start' ? 'ready' : 'disconnected';
        return sendJson(res, 200, session);
      }
    }

    // 7. Webhooks
    if (pathname === '/api/webhooks' && req.method === 'GET') {
      return sendJson(res, 200, webhooks);
    }

    // 8. API Keys
    if (pathname === '/api/auth/api-keys' && req.method === 'GET') {
      return sendJson(res, 200, apiKeys);
    }
    if (pathname === '/api/auth/api-keys' && req.method === 'POST') {
      const newKey = {
        id: 'key-' + Date.now(),
        name: parsedBody.name || 'New API Key',
        keyPrefix: 'openwa_' + (parsedBody.role || 'viewer') + '_' + Math.random().toString(36).substring(2, 6),
        apiKey: 'openwa_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now(),
        role: parsedBody.role || 'viewer',
        allowedSessions: parsedBody.allowedSessions || [],
        isActive: true,
        usageCount: 0,
        createdAt: new Date().toISOString(),
      };
      apiKeys.push(newKey);
      return sendJson(res, 201, newKey);
    }

    // 9. Audit Logs
    if (pathname.startsWith('/api/audit') && req.method === 'GET') {
      return sendJson(res, 200, { data: auditLogs, total: auditLogs.length });
    }

    // 10. Plugins
    if (pathname === '/api/plugins' && req.method === 'GET') {
      return sendJson(res, 200, []);
    }

    // Fallback: 200 with empty object/array
    return sendJson(res, 200, {});
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 OpenWA Demo Mock API running on: http://localhost:${PORT}`);
  console.log(`🔑 Login with any key, e.g.: test-admin`);
  console.log(`======================================================\n`);
});
