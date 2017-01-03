<?php

namespace App\Http\Controllers\Auth;

use Auth;
use JWTAuth;
use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $this->validate($request, [
            'email'    => 'required|email',
            'password' => 'required|min:8',
        ]);

        $credentials = $request->only('email', 'password');

        try {
            // verify the credentials and create a token for the user
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->error('Invalid credentials', 401);
            }
        } catch (\JWTException $e) {
            return response()->error('Could not create token', 500);
        }
        $user = Auth::user();
        
        $compositetoken = new \App\Models\Auth\IToken();
        $compositetoken->accesstoken = $token;
        $compositetoken->tokentype = 'base';
        $compositetoken->identity = new \App\Models\Auth\IUser();
        $compositetoken->identity->id=$user->id;
        $compositetoken->identity->name=$user->firstname;
        $compositetoken->identity->surname=$user->lastname;
        $compositetoken->identity->roleName='SysAdmin';
        $compositetoken->identity->lastAccessDate=(new \DateTime())->format('Y-m-d H:i:s');
        
        return response()->success($compositetoken);
    }

    public function register(Request $request)
    {
        $this->validate($request, [
            'name'       => 'required|min:3',
            'email'      => 'required|email|unique:users',
            'password'   => 'required|min:8',
        ]);

        $user = new User;
        $user->name = trim($request->name);
        $user->email = trim(strtolower($request->email));
        $user->password = bcrypt($request->password);
        $user->save();

        $token = JWTAuth::fromUser($user);

        return response()->success(compact('user', 'token'));
    }
}
