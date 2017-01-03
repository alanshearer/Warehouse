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

        Schema::create('lotstates', function (Blueprint $table) {
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
            $table->String('externalid');
            $table->integer('productstate_id')->unsigned();
            $table->foreign('model_id')->references('id')->on('models');
            $table->foreign('productstate_id')->references('id')->on('productstates');
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
            $table->date('birthDate')->nullable();
            $table->string('email')->unique();
            $table->string('username')->unique();
            $table->string('password');
            $table->rememberToken();
            $table->integer('role_id')->unsigned();
            $table->foreign('role_id')->references('id')->on('roles');
            $table->softDeletes();
        });

        Schema::create('lots', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name')->unique();
            $table->binary('document')->nullable();
            $table->integer('origin_id')->unsigned();
            $table->integer('destination_id')->unsigned();
            $table->foreign('origin_id')->references('id')->on('offices');
            $table->foreign('destination_id')->references('id')->on('offices');
            $table->softDeletes();
        });

        Schema::create('lots_products', function(Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('lot_id')->unsigned();
            $table->integer('product_id')->unsigned();
            $table->foreign('lot_id')->references('id')->on('lots');
            $table->foreign('product_id')->references('id')->on('products');
            $table->softDeletes();
        });

        Schema::create('lots_lotstates', function(Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->binary('document')->nullable();
            $table->integer('lot_id')->unsigned();
            $table->integer('lotstate_id')->unsigned();
            $table->foreign('lot_id')->references('id')->on('lots');
            $table->foreign('lotstate_id')->references('id')->on('lotstates');
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
            $table->string('name')->unique();
            $table->binary('document')->nullable();
            $table->integer('supplier_id')->unsigned();
            $table->foreign('supplier_id')->references('id')->on('suppliers');
            $table->softDeletes();
        });

        Schema::create('orders_models', function(Blueprint $table) {
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
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('categories');
        Schema::dropIfExists('brands');
        Schema::dropIfExists('lotstates');
        Schema::dropIfExists('productstates');
        Schema::dropIfExists('officetypes');
        Schema::dropIfExists('offices');
        Schema::dropIfExists('models');
        Schema::dropIfExists('products');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('users');
        Schema::dropIfExists('lots');
        Schema::dropIfExists('lots_products');
        Schema::dropIfExists('lots_lotstates');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('orders_models');
        Schema::dropIfExists('suppliers');
    }

}
