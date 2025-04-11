# Really Social Blog (Technical Assessment)

A modern blog management system built with Laravel and Quasar Framework, featuring a rich text editor, user authentication, and blog post management capabilities.

## Features

- User authentication (login/register)
- Blog post management (CRUD operations)
- Rich text editor for blog content
- Blog post status management (draft/published)
- Responsive design with Quasar Framework
- Pagination and sorting
- Blog preview functionality
- User dashboard with statistics

## Prerequisites

- PHP >= 8.1
- Composer
- Node.js >= 16
- npm or yarn
- MySQL, SQLITE, or PostgreSQL

## Installation

1. Clone the repository:
```bash
git clone https://github.com/akosiyawin/rs-laravel-quasar-blog.git
cd rs-laravel-quasar-blog
```

2. Install PHP dependencies:
```bash
composer install

# if you encounter an error with dependency installation:
composer install --ignore-platform-reqs
```


3. Create and configure the environment file:
```bash
cp .env.example .env
php artisan key:generate
```

4. Update the `.env` file with your database credentials **(if not using sqlite)**:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_quasar_blog
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

5. Run database migrations, seeders and generate personal laravel passport key:
```bash
php artisan migrate
php artisan db:seed

php artisan passport:client --personal
```

6. Install JavaScript dependencies:
```bash
npm install
```

7. Start the Laravel development server:
```bash
composer run dev
```

## Usage

1. Access the application at `http://localhost:8000`
2. Register a new account or use the default test credentials:
   - Email: test@example.com
   - Password: password

3. Features available after login:
   - Create new blog posts
   - Edit existing posts
   - Preview posts
   - Toggle post status (draft/published)
   - Archive posts
   - View dashboard statistics

## Development

- Frontend development:
  ```bash
  npm run dev
  ```

- Backend development:
  ```bash
  php artisan serve
  ```

## Technologies Used

- Backend:
  - Laravel 10
  - PHP 8.1+
  - MySQL/PostgreSQL

- Frontend:
  - Vue.js 3
  - Quasar Framework
  - TypeScript
  - Axios

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 