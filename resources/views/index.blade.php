<!DOCTYPE html>
<html lang="it" ng-app="backofficeApp">
    <head>
        <!--        <base href="/#/" />-->
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Expires" content="-1">
        <title>Warehouse</title>
        <link rel="apple-touch-icon-precomposed" sizes="144x144" href="content/vendor/ico/apple-touch-icon-144-precomposed.png">
        <link rel="apple-touch-icon-precomposed" sizes="114x114" href="content/vendor/ico/apple-touch-icon-114-precomposed.png">
        <link rel="apple-touch-icon-precomposed" sizes="72x72" href="content/vendor/ico/apple-touch-icon-72-precomposed.png">
        <link rel="apple-touch-icon-precomposed" href="content/vendor/ico/apple-touch-icon-57-precomposed.png">
        <link rel="shortcut icon" href="content/vendor/ico/favicon.png" type="image/png">
        <link type="text/css" rel="stylesheet" ng-href="content/vendor/css/bootstrap/bootstrap.min.css" />
        <link type="text/css" rel="stylesheet" href="content/vendor/css/bootstrap/bootstrap-themes.css" />
        <link type="text/css" rel="stylesheet" href="content/vendor/css/style.css" />
        <link href="content/plugins/noty/themes/noty.theme.custom.css" rel="stylesheet" />
        <link href="content/css/jsPlumb.css" rel="stylesheet" />
        <link rel="stylesheet" href="content/plugins/jQuery-File-Upload-9.7.0/css/jquery.fileupload.css">
        <link rel="stylesheet" href="content/plugins/jQuery-File-Upload-9.7.0/css/jquery.fileupload-ui.css">
        <link href="content/css/animate.css" rel="stylesheet" />
        <link href="content/plugins/jAlert-master/src/jAlert-v4.css" rel="stylesheet" />
        <!-- CSS adjustments for browsers with JavaScript disabled -->
        <noscript><link rel="stylesheet" href="content/plugins/jQuery-File-Upload-9.7.0/css/jquery.fileupload-noscript.css"></noscript>
        <noscript><link rel="stylesheet" href="content/plugins/jQuery-File-Upload-9.7.0/css/jquery.fileupload-ui-noscript.css"></noscript>

        <link href="content/css/custom.css" rel="stylesheet" />

    </head>
    <body ng-class="getBodyClass()" ng-controller="mainCtrl" data-ng-cloak>
        <div id="wrapper">
            <div id="header" ng-if="isAuthenticated" data-ng-cloak>

                <div class="logo-area clearfix">
                    <a href="#" class="logo"></a>
                </div>

                <div class="tools-bar" ng-if="isAuthenticated" data-ng-cloak>
                    <ul class="nav navbar-nav nav-main-xs">
                        <li><a href="javascript:void(0)" class="icon-toolsbar nav-mini"><i class="fa fa-bars"></i></a></li>
                    </ul>
                    <ul class="nav navbar-nav navbar-right">

                        <li>
                            <a href="#" class="nav-collapse avatar-header" data-toggle="tooltip" title="Show / hide  menu" data-container="body" data-placement="bottom">
                                <img alt="" src="content/vendor/img/avatar.png" class="circle">
                            </a>
                        </li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown">
                                <em>
                                    <strong>Ciao</strong>, @{{currentUser.firstname}} @{{currentUser.lastname}}
                                </em> <i class="dropdown-icon fa fa-angle-down"></i>
                            </a>
                            <ul class="dropdown-menu pull-right icon-right arrow">
                                <li><a href="/#profile"><i class="fa fa-user"></i> Profilo</a></li>
                                <li class="divider"></li>
                                <li><a href="javascript:document.location.reload()" data-ng-click="logout()" title="Logout"><i class="fa fa-sign-out"></i> Logout</a>
                            </ul>
                        </li>
                        <li ng-if="currentUser.companiesRights.length > 0">
                            <a href="#" class="h-seperate" data-toggle="dropdown" title="Cambia azienda" data-container="body" data-placement="left">
                                <i class="fa fa-building-o"></i>
                                <i class="dropdown-icon fa fa-angle-down"></i>
                            </a>
                            <ul class="dropdown-menu pull-right icon-right arrow">
                                <li ng-repeat="item in currentUser.companiesRights">
                                    <a href="javascript:void(0)" ng-click="changeCompany(item)"><span>@{{item.companyName}}</span></a>
                                </li>
                            </ul>
                        </li>
                        <li class="visible-lg">
                            <a href="javascript:void(0)" class="h-seperate" title="Aggiorna pagina" data-jquery-tooltip data-ng-click="refreshPage()">
                                <i class="fa fa-refresh"></i>
                            </a>
                        </li>
                        <li class="visible-lg">
                            <a href="/#changelog" class=" h-seperate" title="Visualizza informazioni" data-jquery-tooltip>
                                <i class="fa fa-info fa-fw"></i><i>(@{{application.version}})</i>
                            </a>
                        </li>
                        <li class="visible-lg">
                            <a href="#" class="h-seperate fullscreen" title="Visualizza a schermo intero" data-jquery-tooltip>
                                <i class="fa fa-expand"></i>
                            </a>
                        </li>
                    </ul>
                </div>

            </div>
            <div id="main">
                <ol id="breadcrumbs" class="breadcrumb" ng-if="isAuthenticated">
                    <li ng-repeat="breadcrumb in breadcrumbs.get() track by breadcrumb.path" ng-class="{ active: $last }" class="fx-fade-left">
                        <a class="uppercase" style="font-size: 0.8em" ng-href="/#@{{ breadcrumb.path}}" ng-if="!$last">@{{breadcrumb.label}}</a>
                        <span ng-if="$last" class="uppercase" style="font-size: 0.8em">@{{breadcrumb.label}}</span>
                    </li>
                </ol>
                <div id="content">
                    <ng-view></ng-view>
                </div>
            </div>
            <nav id="menu" data-jquery-mmenu ng-if="isAuthenticated" data-search="close" data-ng-cloak>
                <ul>
                    <li ng-if="('\'Amministratore\' || \'RespMagazzino\' || \'Controllore\' || \'RespAssistenza\'' | hasRole)"><a href="/#dashboard"><i class="icon fa fa-dashboard"></i> Dashboard </a></li>
                    <li ng-show="('\'Amministratore\'' | hasRole)">
                        <span><i class="icon fa fa-cogs"></i> Amministrazione</span>
                        <ul>
                            <li ng-if="('\'Amministratore\'' | hasRole)"><a ng-href="/#/admin/tables"> Tabelle </a></li>
                            <li ng-if="('\'Amministratore\'' | hasRole)"><a ng-href="/#/admin/configuration"> Configurazione di sistema</a></li>
                            <li ng-if="('\'Amministratore\'' | hasRole)"><a ng-href="/#/roles"><i class="icon fa fa-clock-o"></i> Ruoli </a></li>
                            <li ng-if="('\'Amministratore\'' | hasRole)"><a ng-href="/#/users"><i class="icon fa fa-clock-o"></i> Utenti </a></li>
                            <li ng-if="('\'Amministratore\'' | hasRole)"><a ng-href="/#/categories"><i class="icon fa fa-clock-o"></i> Categorie </a></li>
                            <li ng-if="('\'Amministratore\'' | hasRole)"><a ng-href="/#/brands"><i class="icon fa fa-clock-o"></i> Marche </a></li>
                            <li ng-if="('\'Amministratore\'' | hasRole)"><a ng-href="/#/models"><i class="icon fa fa-clock-o"></i> Modelli </a></li>
                            <li ng-if="('\'Amministratore\'' | hasRole)"><a ng-href="/#/suppliers"><i class="icon fa fa-clock-o"></i> Fornitori </a></li>
                            <li ng-if="('\'Amministratore\'' | hasRole)"><a ng-href="/#/orders"><i class="icon fa fa-bar-chart-o"></i> Ordini </a></li>
                        </ul>
                    </li>
                    <li ng-if="('\'Amministratore\'' | hasRole)"><a ng-href="/#/warehouses"><i class="icon  fa fa-users"></i> Magazzini </a></li>
                    <li ng-if="('\'Amministratore\' || \'RespMagazzino\'' | hasRole)"><a ng-href="/#/offices"><i class="icon  fa fa-file-text-o"></i> Uffici </a></li>
                    <li ng-if="('\'Amministratore\' || \'RespMagazzino\'' | hasRole)"><a ng-href="/#/products"><i class="icon fa fa-clock-o"></i> Prodotti </a></li>
                    <li ng-if="('\'Amministratore\' || \'RespMagazzino\'' | hasRole)"><a ng-href="/#/shippings"><i class="icon fa fa-bar-chart-o"></i> Spedizioni </a></li>
                    <li ng-if="('\'Amministratore\' || \'Controllore\'' | hasRole)"><a ng-href="/#/checks"><i class="icon fa fa-clock-o"></i> Controlli </a></li>
                    <li ng-if="('\'Amministratore\' || \'RespAssistenza\'' | hasRole)"><a ng-href="/#/supports"><i class="icon fa fa-clock-o"></i> Assistenza </a></li>
                </ul>
            </nav>
        </div>


        <!-- Jquery Library -->
        <script type="text/javascript" src="content/vendor/js/jquery.min.js"></script>
        <script type="text/javascript" src="content/vendor/js/jquery.ui.min.js"></script>

        <script type="text/javascript" src="content/vendor/plugins/bootstrap/bootstrap.min.js"></script>
        <script src="content/scripts/angular.min.js"></script>
        <script src="content/scripts/angular-route.min.js"></script>
        <script src="content/scripts/angular-resource.min.js"></script>
        <script src="content/scripts/angular-animate.min.js"></script>
        <script src="content/scripts/angular-local-storage.min.js"></script>
        <!-- sprintf -->
        <script src="content/plugins/sprintf.js-master/dist/sprintf.min.js"></script>
        <script src="content/plugins/sprintf.js-master/dist/angular-sprintf.min.js"></script>
        <!-- Modernizr Library For HTML5 And CSS3 -->
        <script type="text/javascript" src="content/vendor/js/modernizr/modernizr.js"></script>
        <script type="text/javascript" src="content/vendor/plugins/mmenu/jquery.mmenu.js"></script>
        <!-- Library 10+ Form plugins-->
        <script type="text/javascript" src="content/vendor/plugins/form/form.js"></script>
        <!-- Datetime plugins -->
        <script type="text/javascript" src="content/vendor/plugins/datetime/datetime.js"></script>
        <script src="content/vendor/plugins/datetime/locales/bootstrap-datetimepicker.it.js"></script>
        <!-- Library Chart-->
        <script type="text/javascript" src="content/vendor/plugins/chart/chart.js"></script>
        <!-- Library  5+ plugins for bootstrap -->
        <script type="text/javascript" src="content/vendor/plugins/pluginsForBS/pluginsForBS.js"></script>
        <!-- Library 10+ miscellaneous plugins -->
        <script type="text/javascript" src="content/vendor/plugins/miscellaneous/miscellaneous.js"></script>
        <script type="text/javascript" src="content/vendor/plugins/pluginsForBS/pluginsForBS.js"></script>


        <!-- Library Themes Customize-->
        <script type="text/javascript" src="content/vendor/js/caplet.custom.js"></script>
        <!-- Other plugins-->
        <script src="content/plugins/ng-breadcrumbs/dist/ng-breadcrumbs.js"></script>
        <script src="content/plugins/noty/packaged/jquery.noty.packaged.min.js"></script>
        <script src="content/plugins/noty/themes/custom.js"></script>
        <script src="content/plugins/jsPlumb/jquery.jsPlumb-1.6.2-min.js"></script>
        <script src="content/plugins/linq/linq.min.js"></script>
        <script src="content/plugins/highcharts/highcharts.js"></script>
        <script src="content/plugins/highcharts/highcharts-ng.js"></script>

        <script src="content/plugins/jAlert-master/src/jAlert-v4.min.js"></script>
        <script src="content/plugins/jAlert-master/src/jAlert-functions.min.js"></script>


        <script src="content/plugins/zeroclipboard-2.1.6/dist/ZeroClipboard.min.js"></script>
        <script src="content/plugins/ng-clip-master/src/ngClip.js"></script>

        <script src="content/plugins/jQuery-File-Upload-9.7.0/jquery.iframe-transport.js"></script>
        <!-- The basic File Upload plugin -->
        <script src="content/plugins/jQuery-File-Upload-9.7.0/jquery.fileupload.js"></script>
        <!-- The File Upload processing plugin -->
        <script src="content/plugins/jQuery-File-Upload-9.7.0/jquery.fileupload-process.js"></script>
        <!-- The File Upload validation plugin -->
        <script src="content/plugins/jQuery-File-Upload-9.7.0/jquery.fileupload-validate.js"></script>
        <!-- The File Upload Angular JS module -->
        <script src="content/plugins/jQuery-File-Upload-9.7.0/jquery.fileupload-angular.js"></script>

        <script src="content/plugins/jquery.inputmask/jquery.inputmask.bundle.min.js"></script>
        <!--<script src="content/plugins/angular-ui/ui-bootstrap.min.js"></script>-->
        <script src="content/plugins/angular-ui/ui-bootstrap-tpls.min.js"></script>

        <script src="configuration/configuration.js"></script>
        <script src="common/filters/filters.js"></script>
        <script src="common/directives/directives.js"></script>
        <script src="common/services/authentication/authentication.js"></script>
        <script src="common/services/notification/notification.js"></script>

        <!-- angular caching & caching custom service -->
        <script src="common/services/caching/plugins/angular-cache.min.js"></script>
        <script src="common/services/caching/caching.js"></script>
        <!------------------------------------------------------------>
    <!--    <script src="../references/Enums.js"></script>-->
        <script src="app/backoffice/controllers/controllers.js"></script>
        <script src="app/backoffice/filters/filters.js"></script>
        <script src="app/backoffice/main.js"></script>
    </body>
</html>