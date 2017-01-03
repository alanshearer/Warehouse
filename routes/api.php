<?php // use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('auth/login', 'Auth\AuthController@login');
Route::post('auth/register', 'Auth\AuthController@register');

Route::post('auth/password/email', 'Auth\PasswordResetController@sendResetLinkEmail');
Route::get('auth/password/verify', 'Auth\PasswordResetController@verify');
Route::post('auth/password/reset', 'Auth\PasswordResetController@reset');


//protected API routes with JWT (must be logged in)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');

Route::get('brands', 'BrandController@index')->middleware('auth:api');
Route::get('brands/{id}', 'BrandController@get');
Route::post('brands','BrandController@create');
Route::put('brands/{id}','BrandController@update');    
Route::delete('brands/{id}','BrandController@delete');

Route::get('categories', 'CategoryController@index');
Route::get('categories/{id}', 'CategoryController@get');
Route::post('categories','CategoryController@create');
Route::put('categories/{id}','CategoryController@update');    
Route::delete('categories/{id}','CategoryController@delete');

Route::get('orders', 'OrderController@index');
Route::get('orders/{id}', 'OrderController@get');
Route::post('orders','OrderController@create');
Route::put('orders/{id}','OrderController@update');    
Route::delete('orders/{id}','OrderController@delete');

Route::get('lots', 'LotController@index');
Route::get('lots/{id}', 'LotController@get');
Route::post('lots','LotController@create');
Route::put('lots/{id}','LotController@update');    
Route::delete('lots/{id}','LotController@delete');

Route::get('lotstates', 'LotstateController@index');
Route::get('lotstates/{id}', 'LotstateController@get');
Route::post('lotstates','LotstateController@create');
Route::put('lotstates/{id}','LotstateController@update');    
Route::delete('lotstates/{id}','LotstateController@delete');

Route::get('models', 'ModelController@index');
Route::get('models/{id}', 'ModelController@get');
Route::post('models','ModelController@create');
Route::put('models/{id}','ModelController@update');    
Route::delete('models/{id}','ModelController@delete');

Route::get('offices', 'OfficeController@index');
Route::get('offices/{id}', 'OfficeController@get');
Route::post('offices','OfficeController@create');
Route::put('offices/{id}','OfficeController@update');    
Route::delete('offices/{id}','OfficeController@delete');

Route::get('officetypes', 'OfficetypeController@index');
Route::get('officetypes/{id}', 'OfficetypeController@get');
Route::post('officetypes','OfficetypeController@create');
Route::put('officetypes/{id}','OfficetypeController@update');    
Route::delete('officetypes/{id}','OfficetypeController@delete');

Route::get('products', 'ProductController@index');
Route::get('products/{id}', 'ProductController@get');
Route::post('products','ProductController@create');
Route::put('products/{id}','ProductController@update');    
Route::delete('products/{id}','ProductController@delete');

Route::get('productstates', 'ProductstateController@index');
Route::get('productstates/{id}', 'ProductstateController@get');
Route::post('productstates','ProductstateController@create');
Route::put('productstates/{id}','ProductstateController@update');    
Route::delete('productstates/{id}','ProductstateController@delete');

Route::get('roles/{page}/{elements}/{orderby?}/{desc?}', 'RoleController@search');
Route::get('roles/kvp', 'RoleController@kvp');
Route::get('roles', 'RoleController@index');
Route::get('roles/{id}', 'RoleController@get');
Route::post('roles','RoleController@create');
Route::put('roles/{id}','RoleController@update');    
Route::delete('roles/{id}','RoleController@delete');

Route::get('users', 'UserController@index');
Route::get('users/{id}', 'UserController@get');
Route::post('users','UserController@create');
Route::put('users/{id}','UserController@update');    
Route::delete('users/{id}','UserController@delete');


Route::get('suppliers/{page}/{elements}/{orderby?}/{desc?}', 'SupplierController@search');
Route::get('suppliers', 'SupplierController@index');
Route::get('suppliers/{id}', 'SupplierController@get');
Route::post('suppliers','SupplierController@create');
Route::put('suppliers/{id}','SupplierController@update');    
Route::delete('suppliers/{id}','SupplierController@delete');