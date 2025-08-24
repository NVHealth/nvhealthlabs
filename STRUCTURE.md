.
├── __tests__
│   └── api-architecture.test.js
├── API_ARCHITECTURE.md
├── app
│   ├── about
│   │   └── page.tsx
│   ├── admin
│   │   ├── centers
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   └── tests
│   │       ├── loading.tsx
│   │       └── page.tsx
│   ├── api
│   │   ├── admin
│   │   │   ├── centers
│   │   │   │   ├── [id]
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── tests
│   │   │   │   ├── [id]
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── users
│   │   │       └── route.ts
│   │   ├── auth
│   │   │   ├── login
│   │   │   │   └── route.ts
│   │   │   ├── login-secure
│   │   │   │   └── route.ts
│   │   │   ├── otp-secure
│   │   │   │   └── route.ts
│   │   │   ├── register
│   │   │   │   └── route.ts
│   │   │   ├── send-email
│   │   │   │   └── route.ts
│   │   │   ├── send-otp
│   │   │   ├── send-verification
│   │   │   │   └── route.ts
│   │   │   ├── test-verification
│   │   │   ├── verify-code
│   │   │   │   └── route.ts
│   │   │   ├── verify-email
│   │   │   └── verify-otp
│   │   │       └── route.ts
│   │   ├── bookings
│   │   │   └── route.ts
│   │   ├── centers
│   │   │   └── route.ts
│   │   ├── config
│   │   │   ├── constants.ts
│   │   │   └── env.ts
│   │   ├── controllers
│   │   │   ├── auth.controller.ts
│   │   │   └── user.controller.ts
│   │   ├── debug
│   │   │   └── users
│   │   │       └── route.ts
│   │   ├── docs
│   │   │   └── page.tsx
│   │   ├── integration
│   │   │   ├── bookings
│   │   │   │   └── route.ts
│   │   │   ├── results
│   │   │   │   └── route.ts
│   │   │   └── status
│   │   │       └── route.ts
│   │   ├── middlewares
│   │   │   ├── auth.middleware.ts
│   │   │   └── role.middleware.ts
│   │   ├── models
│   │   │   └── prisma.ts
│   │   ├── patient
│   │   │   └── dashboard
│   │   │       └── route.ts
│   │   ├── payments
│   │   │   └── create-intent
│   │   │       └── route.ts
│   │   ├── schemas
│   │   │   └── user.schema.ts
│   │   ├── services
│   │   │   ├── auth.service.ts
│   │   │   └── user.service.ts
│   │   ├── test-supabase
│   │   ├── tests
│   │   │   └── route.ts
│   │   ├── users
│   │   │   ├── [id]
│   │   │   │   ├── route.ts
│   │   │   │   ├── status
│   │   │   │   │   └── route.ts
│   │   │   │   └── verify
│   │   │   │       └── route.ts
│   │   │   ├── me
│   │   │   │   └── route.ts
│   │   │   ├── route.ts
│   │   │   ├── search
│   │   │   │   └── route.ts
│   │   │   └── stats
│   │   │       └── route.ts
│   │   └── utils
│   │       ├── errorHandler.ts
│   │       └── jwt.ts
│   ├── auth
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── register
│   │   │   └── page.tsx
│   │   └── verify-email
│   ├── center
│   │   ├── dashboard
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── orders
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   └── results
│   │       ├── loading.tsx
│   │       └── page.tsx
│   ├── centers
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── contact
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── nvcustomer
│   │   ├── bookings
│   │   │   └── page.tsx
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   ├── profile
│   │   │   └── page.tsx
│   │   └── results
│   │       └── page.tsx
│   ├── packages
│   │   └── page.tsx
│   ├── page.tsx
│   ├── test-supabase
│   └── tests
│       ├── loading.tsx
│       └── page.tsx
├── ARCHITECTURE.md
├── AUTHENTICATION.md
├── components
│   ├── auth-provider.tsx
│   ├── logo.tsx
│   ├── logout-button.tsx
│   ├── protected-route-new.tsx
│   ├── protected-route.tsx
│   ├── theme-provider.tsx
│   ├── two-factor-verification.tsx
│   └── ui
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       ├── tooltip.tsx
│       ├── use-mobile.tsx
│       └── use-toast.ts
├── components.json
├── EMAIL_SETUP.md
├── hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib
│   ├── audit
│   │   └── audit-logger.ts
│   ├── auth.ts
│   ├── config
│   │   └── security-config.ts
│   ├── database.ts
│   ├── email-service.ts
│   ├── generated
│   │   └── prisma
│   │       ├── client.d.ts
│   │       ├── client.js
│   │       ├── default.d.ts
│   │       ├── default.js
│   │       ├── edge.d.ts
│   │       ├── edge.js
│   │       ├── index-browser.js
│   │       ├── index.d.ts
│   │       ├── index.js
│   │       ├── libquery_engine-darwin-arm64.dylib.node
│   │       ├── package.json
│   │       ├── runtime
│   │       │   ├── edge-esm.js
│   │       │   ├── edge.js
│   │       │   ├── index-browser.d.ts
│   │       │   ├── index-browser.js
│   │       │   ├── library.d.ts
│   │       │   ├── library.js
│   │       │   ├── react-native.js
│   │       │   ├── wasm-compiler-edge.js
│   │       │   └── wasm-engine-edge.js
│   │       ├── schema.prisma
│   │       ├── wasm.d.ts
│   │       └── wasm.js
│   ├── prisma.ts
│   ├── security
│   │   ├── auth-middleware.ts
│   │   ├── rate-limiter.ts
│   │   └── secure-otp-service.ts
│   ├── user-service-old.ts.backup
│   ├── user-service-prisma.ts
│   ├── user-service.ts
│   ├── utils.ts
│   └── verification-db.ts
├── middleware.ts
├── next-env.d.ts
├── next.config.mjs
├── OTP_MIGRATION_SUMMARY.md
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── prisma
│   └── schema.prisma
├── public
│   ├── images
│   │   ├── nvhealth-logo.png
│   │   └── nvicon.png
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
├── README.md
├── scripts
│   ├── create-test-users.js
│   ├── update-user-roles.js
│   ├── v1
│   │   ├── admin-portal-schema-postgres.sql
│   │   ├── admin-portal-schema.sql
│   │   ├── migrate-to-otp-verification.sql
│   │   ├── README-PostgreSQL-Migration.md
│   │   ├── seed-data-postgres.sql
│   │   ├── seed-data.sql
│   │   ├── setup-complete-postgres.sh
│   │   ├── setup-database-postgres.sql
│   │   ├── setup-database.sql
│   │   ├── setup-postgres.sh
│   │   ├── update-verification-schema-postgres.sql
│   │   └── update-verification-schema.sql
│   └── v2
│       └── setup-database.sql
├── SECURITY_ARCHITECTURE.md
├── STRUCTURE.md
├── styles
│   └── globals.css
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── utils
    └── supabase

93 directories, 210 files
