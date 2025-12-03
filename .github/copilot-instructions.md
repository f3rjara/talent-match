# Copilot Instructions - TalentMatch

## Architecture Overview

This is an **Angular 19 standalone application** (no NgModules) for talent matching between companies and candidates. Built with:
- **PrimeNG** components with custom theme (`FlowMatchPreset` in `theme.config.ts`)
- **Tailwind CSS** for utility styling
- **Jest** for testing (not Karma)
- Two distinct user flows: `empresa` (company) and `candidato` (candidate)

### Key Architectural Decisions

**Dual User Flow Architecture**: The app has two separate UIs:
- `/empresa` - Company portal (manage vacancies, view applications)
- `/candidato` - Candidate portal (browse offers, apply, track postulations)

Both flows are lazy-loaded through `app.routes.ts` and have their own routing modules:
- `src/app/ui/company/company.routes.ts`
- `src/app/ui/candidate/candidate.routes.ts`

**Authentication Pattern**: Uses functional interceptor (`authInterceptor`) that automatically attaches Bearer tokens via `TokenService`. Auth data stored in `sessionStorage`, not `localStorage`.

**State Management**: Signal-based reactivity (Angular Signals). See `available-offers.component.ts` for the pattern:
```typescript
vacancies = signal<Vacancy[]>([]);
loading = signal<boolean>(true);
```

## Project Structure

```
src/app/
├── core/               # Singleton services, interceptors, models
│   ├── interceptors/   # HTTP interceptors (auth.interceptor.ts)
│   ├── services/       # Auth services (token.service.ts, auth-company.service.ts)
│   ├── models/         # TypeScript models (auth.model.ts, user.model.ts)
│   └── guards/         # Route guards (currently empty, add here)
├── shared/             # Reusable code across features
│   ├── interfaces/     # Shared interfaces (vacancy.interface.ts)
│   ├── constants/      # App-wide constants
│   ├── directives/     # Reusable directives
│   └── pipes/          # Custom pipes
├── ui/                 # Feature modules organized by user type
│   ├── company/        # Company portal pages
│   ├── candidate/      # Candidate portal pages
│   └── components/     # Atomic Design structure (atoms/molecules/organisms/templates)
└── configs/            # App configuration
```

## Component Architecture

**Atomic Design Pattern**: Components organized as:
- `atoms/` - Basic building blocks (buttons, inputs)
- `molecules/` - Simple component groups
- `organisms/` - Complex UI sections
- `templates/` - Page layouts

**All components use standalone APIs**. Import dependencies directly in the `@Component` decorator's `imports` array:

```typescript
@Component({
  selector: 'app-available-offers',
  imports: [CommonModule, ButtonModule, CardModule, TagModule],
  templateUrl: './available-offers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

**Feature-scoped services**: Services specific to a feature live in `pages/<feature>/services/` (e.g., `vacancy.service.ts` exists separately in both `company/` and `candidate/` modules).

## Development Workflows

### Running the App
- **Development**: `npm start` (serves with `-o` flag, auto-opens browser)
- **Build Production**: `npm run prod` (sets `--base-href=/`)
- **Watch Mode**: `npm run watch`

### Testing
- **Run tests**: `npm test` (uses Jest, not `ng test`)
- **Watch mode**: `npm run test:watch`
- **Coverage**: `npm run test:coverage` (minimum 70% required)
- **Staged files**: `npm run test:staged` (for pre-commit hooks)

**Testing framework**: Jest with `jest-preset-angular`. Configuration in `jest.config.ts`. Setup file: `setup-jest.ts`.

### Linting
- `npm run lint` - Angular ESLint
- `npm run lint-all` - ESLint with auto-fix
- `npm run lint-watch` - Watch mode with nodemon

### Code Quality Standards

**ESLint rules** (`.eslintrc.json`):
- Max 750 lines per file, 35 per function
- Cyclomatic complexity limit: 10
- **No console.log or debugger** in production code
- Component selector prefix: `app-`
- Directive prefix: `app` (camelCase)

**Commit conventions**: Use Conventional Commits (enforced by `git-commit-msg-linter`):
```
feat: add candidate profile page
fix: resolve auth token refresh issue
chore: update dependencies
```

## Environment Configuration

**Token-based environments**: Production uses `#{}#` tokens replaced at deployment:
```typescript
// src/environments/environment.ts
AUTH_API_URL: '#{AUTH_API_URL}#',
VACANCIES_API_URL: '#{VACANCIES_API_URL}#',
```

**Development environment**: Uses `fileReplacements` in `angular.json` to swap `environment.ts` with `environment.development.ts`.

## Path Aliases

Use TypeScript path aliases (defined in `tsconfig.json`):
```typescript
import { AuthService } from '@core/services/auth.service';
import { Vacancy } from '@shared/interfaces/vacancy.interface';
import { environment } from '@src/environments/environment';
```

Available aliases: `@src`, `@app`, `@shared`, `@core`, `@store`, `@atoms`, `@molecules`, `@organisms`, `@templates`, `@interfaces`, `@directives`

## Styling

**PrimeNG Theme**: Custom theme in `theme.config.ts` using `FlowMatchPreset`
- Primary: `#0d1e40`
- Secondary: `#2bc7d9`
- Dark mode selector: `.dark-mode`

**SCSS structure**:
- Global styles: `src/assets/scss/_global.scss`
- Variables: `src/assets/scss/_vars.scss`
- Component-scoped: `*.component.scss` (preferred)

**Tailwind**: Configured with PrimeUI plugin (`tailwindcss-primeui`)

## HTTP & Services

**Interceptor Pattern**: `authInterceptor` in `app.config.ts` automatically adds Bearer tokens except for auth endpoints:
```typescript
provideHttpClient(withInterceptors([authInterceptor]))
```

**Service injection**: Use `inject()` function (modern pattern):
```typescript
private readonly _router = inject(Router);
private readonly _vacancyService = inject(VacancyService);
```

**Service naming**: Prefix private injected services with underscore (`_router`, `_vacancyService`)

## Deployment

**Docker**: Multi-stage build with nginx:
- Build stage: Node 20 Alpine
- Production: nginx:alpine with non-root user
- Output: `public/browser` directory
- Health check on port 80

**Output path**: `public/` (configured in `angular.json` builder options)

## Common Patterns

**Signal-based components**: Use signals for reactive state, avoid BehaviorSubject unless sharing across services.

**Router navigation with query params**:
```typescript
this._router.navigate(['/candidato/aplicar/${id}'], {
  queryParams: { title: vacancy.title }
});
```

**PrimeNG severity mapping**: Map application statuses to PrimeNG severities:
```typescript
getStatusSeverity(status: string): 'success' | 'danger' | 'warning' {
  return { open: 'success', closed: 'danger', paused: 'warning' }[status];
}
```

## Troubleshooting

- **Test failures**: Ensure Jest terminal is running (`npm test`), not Karma
- **Path alias errors**: Check `tsconfig.json` paths and restart TS server
- **PrimeNG theme not applying**: Verify `theme.config.ts` is imported in `app.config.ts`
- **Auth token not attaching**: Check if URL is excluded in `authInterceptor`
