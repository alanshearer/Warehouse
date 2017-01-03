# Warehouse

composer create-project jadjoubran/laravel5-angular-material-starter --prefer-dist
mv laravel5-angular-material-starter Warehouse
cd Warehouse
npm install -g gulp bower --save
npm remove laravel-elixir laravel-elixir-eslint --save
npm install typescript gulp-typescript del
npm install
bower install
#fix database credentials in .env
php artisan migrate
gulp