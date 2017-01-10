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

Route::get('categories/{page}/{elements}/{orderby?}/{desc?}', 'CategoryController@search');
Route::get('categories', 'CategoryController@index');
Route::get('categories/xls', 'CategoryController@xls');
Route::get('categories/kvp', 'CategoryController@kvp');
Route::get('categories/{id}', 'CategoryController@get');
Route::post('categories','CategoryController@create');
Route::put('categories/{id}','CategoryController@update');    
Route::delete('categories/{id}','CategoryController@delete');

Route::get('brands/{page}/{elements}/{orderby?}/{desc?}', 'BrandController@search');
Route::get('brands', 'BrandController@index');
Route::get('brands/xls', 'BrandController@xls');
Route::get('brands/kvp', 'BrandController@kvp');
Route::get('brands/{id}', 'BrandController@get');
Route::post('brands','BrandController@create');
Route::put('brands/{id}','BrandController@update');    
Route::delete('brands/{id}','BrandController@delete');

Route::get('offices/{page}/{elements}/{orderby?}/{desc?}', 'OfficeController@search');
Route::get('offices', 'OfficeController@index');
Route::get('offices/xls', 'OfficeController@xls');
Route::get('offices/kvp', 'OfficeController@kvp');
Route::get('offices/{id}', 'OfficeController@get');
Route::post('offices','OfficeController@create');
Route::put('offices/{id}','OfficeController@update');    
Route::delete('offices/{id}','OfficeController@delete');

Route::get('models/{page}/{elements}/{orderby?}/{desc?}', 'ModelController@search');
Route::get('models', 'ModelController@index');
Route::get('models/xls', 'ModelController@xls');
Route::get('models/kvp', 'ModelController@kvp');
Route::get('models/{id}', 'ModelController@get');
Route::post('models','ModelController@create');
Route::put('models/{id}','ModelController@update');    
Route::delete('models/{id}','ModelController@delete');

Route::get('products/{page}/{elements}/{orderby?}/{desc?}', 'ProductController@search');
Route::get('products', 'ProductController@index');
Route::get('products/xls', 'ProductController@xls');
Route::get('products/kvp', 'ProductController@kvp');
Route::get('products/{id}', 'ProductController@get');
Route::post('products','ProductController@create');
Route::put('products/{id}','ProductController@update');    
Route::delete('products/{id}','ProductController@delete');

Route::get('suppliers/{page}/{elements}/{orderby?}/{desc?}', 'SupplierController@search');
Route::get('suppliers', 'SupplierController@index');
Route::get('suppliers/xls', 'SupplierController@xls');
Route::get('suppliers/{id}', 'SupplierController@get');
Route::post('suppliers','SupplierController@create');
Route::put('suppliers/{id}','SupplierController@update');    
Route::delete('suppliers/{id}','SupplierController@delete');

Route::get('roles/{page}/{elements}/{orderby?}/{desc?}', 'RoleController@search');
Route::get('roles/kvp', 'RoleController@kvp');
Route::get('roles', 'RoleController@index');
Route::get('roles/{id}', 'RoleController@get');
Route::post('roles','RoleController@create');
Route::put('roles/{id}','RoleController@update');    
Route::delete('roles/{id}','RoleController@delete');

Route::get('users/{page}/{elements}/{userby?}/{desc?}', 'UserController@search');
Route::get('users', 'UserController@index');
Route::get('users/xls', 'UserController@xls');
Route::get('users/kvp', 'UserController@kvp');
Route::get('users/{id}', 'UserController@get');
Route::post('users','UserController@create');
Route::put('users/{id}','UserController@update');    
Route::delete('users/{id}','UserController@delete');

Route::get('orders/{page}/{elements}/{orderby?}/{desc?}', 'OrderController@search');
Route::get('orders', 'OrderController@index');
Route::get('orders/xls', 'OrderController@xls');
Route::get('orders/kvp', 'OrderController@kvp');
Route::get('orders/{id}', 'OrderController@get');
Route::post('orders','OrderController@create');
Route::put('orders/{id}','OrderController@update');    
Route::delete('orders/{id}','OrderController@delete');

Route::get('shippings/{page}/{elements}/{shippingby?}/{desc?}', 'ShippingController@search');
Route::get('shippings', 'ShippingController@index');
Route::get('shippings/xls', 'ShippingController@xls');
Route::get('shippings/kvp', 'ShippingController@kvp');
Route::get('shippings/{id}', 'ShippingController@get');
Route::post('shippings','ShippingController@create');
Route::put('shippings/{id}','ShippingController@update');    
Route::delete('shippings/{id}','ShippingController@delete');

Route::get('lotstates', 'LotstateController@index');
Route::get('lotstates/{id}', 'LotstateController@get');
Route::post('lotstates','LotstateController@create');
Route::put('lotstates/{id}','LotstateController@update');    
Route::delete('lotstates/{id}','LotstateController@delete');


Route::get('officetypes', 'OfficetypeController@index');
Route::get('officetypes/{id}', 'OfficetypeController@get');
Route::post('officetypes','OfficetypeController@create');
Route::put('officetypes/{id}','OfficetypeController@update');    
Route::delete('officetypes/{id}','OfficetypeController@delete');

Route::get('productstates', 'ProductstateController@index');
Route::get('productstates/{id}', 'ProductstateController@get');
Route::post('productstates','ProductstateController@create');
Route::put('productstates/{id}','ProductstateController@update');    
Route::delete('productstates/{id}','ProductstateController@delete');

Route::get('users', 'UserController@index');
Route::get('users/{id}', 'UserController@get');
Route::post('users','UserController@create');
Route::put('users/{id}','UserController@update');    
Route::delete('users/{id}','UserController@delete');

Route::get('locations/countries', 'LocationController@countries');
Route::get('locations/counties/{id}', 'LocationController@counties');
Route::get('locations/cities/{id}', 'LocationController@cities');
Route::get('locations/city/{id}', 'LocationController@city');



