<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Response;

class ResponseMacroServiceProvider extends ServiceProvider {

    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot() {
//        Response::macro('success', function ($data) {
//            return Response::json([
//                'errors'  => false,
//                'data' => $data,
//            ]);
//        });
        Response::macro('success', function ($data) {
            return Response::json($data);
        });

        Response::macro('error', function ($message, $status = 400) {
            return Response::json([
                        'message' => $message,
                        'statusCode' => $status,
                            ], $status);
        });
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register() {
        //
    }

}
