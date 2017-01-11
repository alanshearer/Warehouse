<?php

//

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class InitDbWithMainTables extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {

        Schema::enableForeignKeyConstraints();
        //Schema::disableForeignKeyConstraints();

        Schema::create('countries', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name')->unique();
            $table->string('code')->nullable();
            $table->string('uic_id')->nullable();
            $table->softDeletes();
        });

        Schema::create('regions', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name')->unique();
            $table->string('position')->nullable();
            $table->integer('country_id')->unsigned();
            $table->foreign('country_id')->references('id')->on('countries');
            $table->softDeletes();
        });

        Schema::create('counties', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name')->unique();
            $table->string('code')->nullable();
            $table->integer('region_id')->unsigned();
            $table->foreign('region_id')->references('id')->on('regions');
            $table->softDeletes();
        });

        Schema::create('cities', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name');
            $table->string('istatcode')->nullable();
            $table->string('postalcode')->nullable();
            $table->integer('county_id')->unsigned();
            $table->foreign('county_id')->references('id')->on('counties');
            $table->softDeletes();
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->string('note')->nullable();
            $table->softDeletes();
        });

        Schema::create('brands', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->string('note')->nullable();
            $table->softDeletes();
        });

        Schema::create('shippingstates', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->softDeletes();
        });

        Schema::create('orderstates', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->softDeletes();
        });

        Schema::create('productstates', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->softDeletes();
        });

        Schema::create('productworkingstates', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->softDeletes();
        });
        Schema::create('officetypes', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->softDeletes();
        });

        Schema::create('offices', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name')->unique();
            $table->string('address');
            $table->string('postalcode');
            $table->integer('city_id')->unsigned();
            $table->foreign('city_id')->references('id')->on('cities');
            $table->integer('officetype_id')->unsigned();
            $table->foreign('officetype_id')->references('id')->on('officetypes');
            $table->integer('parent_id')->unsigned()->nullable();
            $table->foreign('parent_id')->references('id')->on('offices');
            $table->softDeletes();
        });

        Schema::create('models', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('category_id')->unsigned();
            $table->integer('brand_id')->unsigned();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->string('note')->nullable();
            //$table->decimal('price');
            $table->foreign('category_id')->references('id')->on('categories');
            $table->foreign('brand_id')->references('id')->on('brands');
            $table->softDeletes();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('model_id')->unsigned();
            $table->string('note')->nullable();
            $table->decimal('price');
            $table->string('serial')->nullable();
            $table->string('external_id')->nullable();
            $table->string('productstate_id')->nullable();
            $table->foreign('model_id')->references('id')->on('models');
            $table->softDeletes();
        });

        Schema::create('roles', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->softDeletes();
        });

        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('firstname')->nullable();
            $table->string('lastname')->nullable();
            $table->date('birthdate')->nullable();
            $table->string('email')->unique();
            $table->string('username')->unique();
            $table->string('password');
            $table->rememberToken();
            $table->integer('role_id')->unsigned();
            $table->foreign('role_id')->references('id')->on('roles');
            $table->softDeletes();
        });
        
        Schema::create('user_office', function(Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->date('startdate')->nullable();
            $table->date('enddate')->nullable();
            $table->integer('user_id')->unsigned();
            $table->integer('office_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('office_id')->references('id')->on('offices');
            $table->softDeletes();
        });
        
        Schema::create('shippings', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->date('date');
            $table->string('note')->nullable();
            $table->integer('origin_id')->unsigned();
            $table->integer('destination_id')->unsigned();
            $table->foreign('origin_id')->references('id')->on('offices');
            $table->foreign('destination_id')->references('id')->on('offices');
            $table->softDeletes();
        });

        Schema::create('shipping_product', function(Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('shipping_id')->unsigned();
            $table->integer('product_id')->unsigned();
            $table->foreign('shipping_id')->references('id')->on('shippings');
            $table->foreign('product_id')->references('id')->on('products');
            $table->softDeletes();
        });

        Schema::create('office_product', function(Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('office_id')->unsigned();
            $table->integer('product_id')->unsigned();
            $table->foreign('office_id')->references('id')->on('offices');
            $table->foreign('product_id')->references('id')->on('products');
            $table->softDeletes();
        });

        Schema::create('shipping_shippingstate', function(Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->date('date');
            $table->binary('document')->nullable();
            $table->integer('shipping_id')->unsigned();
            $table->integer('shippingstate_id')->unsigned();
            $table->foreign('shipping_id')->references('id')->on('shippings');
            $table->foreign('shippingstate_id')->references('id')->on('shippingstates');
            $table->softDeletes();
        });

        Schema::create('suppliers', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name')->unique();
            $table->string('vatcode');
            $table->string('address');
            $table->string('postalcode');
            $table->integer('city_id')->unsigned();
            $table->foreign('city_id')->references('id')->on('cities');
            $table->softDeletes();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->date('date');
            $table->string('note')->nullable();
            $table->integer('supplier_id')->unsigned();
            $table->foreign('supplier_id')->references('id')->on('suppliers');
            $table->softDeletes();
        });

        Schema::create('order_orderstate', function(Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->date('date');
            $table->binary('document')->nullable();
            $table->integer('order_id')->unsigned();
            $table->integer('orderstate_id')->unsigned();
            $table->foreign('order_id')->references('id')->on('orders');
            $table->foreign('orderstate_id')->references('id')->on('orderstates');
            $table->softDeletes();
        });

        Schema::create('order_model', function(Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('order_id')->unsigned();
            $table->integer('model_id')->unsigned();
            $table->foreign('order_id')->references('id')->on('orders');
            $table->foreign('model_id')->references('id')->on('models');
            $table->integer('quantity');
            $table->integer('left')->nullable();
            $table->softDeletes();
        });

        Schema::create('product_productworkingstate', function(Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->date('date');
            $table->integer('product_id')->unsigned();
            $table->integer('productworkingstate_id')->unsigned();
            $table->foreign('product_id')->references('id')->on('products');
            $table->foreign('productworkingstate_id')->references('id')->on('productworkingstates');
            $table->softDeletes();
        });

        Schema::create('checks', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->date('date');
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users');
            $table->integer('product_id')->unsigned();
            $table->foreign('product_id')->references('id')->on('products');
            $table->integer('productworkingstate_id')->unsigned();
            $table->foreign('productworkingstate_id')->references('id')->on('productworkingstates');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('categories');
        Schema::dropIfExists('brands');
        Schema::dropIfExists('shippingstates');
        Schema::dropIfExists('productstates');
        Schema::dropIfExists('officetypes');
        Schema::dropIfExists('offices');
        Schema::dropIfExists('models');
        Schema::dropIfExists('products');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('users');
        Schema::dropIfExists('shippings');
        Schema::dropIfExists('shippings_products');
        Schema::dropIfExists('shippings_shippingstates');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('orders_models');
        Schema::dropIfExists('suppliers');
    }

}
