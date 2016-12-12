/**
 * Created by bjwsl-001 on 2016/10/10.
 */

//完成模块的声明
var app = angular.module('kaifanla',['ng','ngRoute','ngAnimate']);

//创建一个parentCtrl
app.controller('parentCtrl',
    ["$scope","$location",
        function ($scope,$location) {
            $scope.jump = function (url) {
                $location.path(url);
            }
    }]);

//声明控制器mainCtrl main.html 功能是支持搜索和分页加载
app.controller('mainCtrl',['$scope','$http',
    function($scope,$http){
        $scope.hasMore = true;
        //加载数据
        $http.get('data/dish_getbypage.php?start=0')
            .success(function (data) {
                //console.log(data);
                $scope.dishList = data;
				$scope.a=$scope.dishList;
            })
        //加载更多数据
        $scope.loadMore = function () {
            $http.get('data/dish_getbypage.php?start='+$scope.dishList.length)
                .success(function (data) {
                    if(data.length < 5)
                    {
                        $scope.hasMore = false;
                    }
                    $scope.dishList = $scope.dishList.concat(data);
                });
        }
        
        //添加搜索功能
        $scope.$watch('kw', function () {
            console.log($scope.kw);
            if($scope.kw)
            {
                $http.get('data/dish_getbykw.php?kw='+$scope.kw)
                    .success(function (data) {
                        $scope.dishList = data;
                    })
            }else{
				$scope.dishList=$scope.a;
			}
			console.log($scope.dishList);

        });
}]);

//声明控制器 detailCtrl,功能是根据传过来的dishId查找菜品详情
app.controller('detailCtrl',['$scope','$http','$routeParams',
    function ($scope,$http,$routeParams) {
        console.log($routeParams.dishId);
        $http.get('data/dish_getbyid.php?id='+$routeParams.dishId)
            .success(function (data) {
                console.log(data);
                $scope.dish = data[0];
            })
}]);

//声明控制器orderDetail 拿到dishId，把用户所输入的所有信息和dishId 传递给服务器
app.controller('orderDetail',['$scope','$http','$routeParams','$rootScope',
    function ($scope,$http,$routeParams,$rootScope) {
        //console.log($routeParams.dishId);

        $scope.order = {"did":$routeParams.dishId};

        $scope.submitOrder = function () {
            var args = jQuery.param($scope.order);
            console.log(args);
            $http.get('data/order_add.php?'+args)
                .success(function (data) {
                    console.log(data);
                    if(data.msg == 'succ')
                    {
                        $rootScope.phone = $scope.order.phone;
                        $scope.succMsg = "下单成功！订单编号为："+data.oid;
                    }
                    else
                    {
                        $scope.errMsg = '下单失败';
                    }
                })
        }

}]);

//声明控制器myOrderCtrl
app.controller('myOrderCtrl',['$scope','$http','$rootScope',
    function ($scope,$http,$rootScope) {
		if($rootScope.phone){
			  $http.get('data/order_getbyphone.php?phone='+$rootScope.phone)
				.success(function(data){
					$scope.orderList = data;
				})
			}else {
			  alert('您尚未下单！请先下单！');
			}

}]);

//配置路由词典
app.config(function ($routeProvider) {

    $routeProvider
        .when('/start',{
            templateUrl:'tpl/start.html'
        })
        .when('/main',{
            templateUrl:'tpl/main.html',
            controller:'mainCtrl'
        })
        .when('/detail',{
            templateUrl:'tpl/detail.html'
        })
        .when('/detail/:dishId',{
            templateUrl:'tpl/detail.html',
            controller:'detailCtrl'
        })
        .when('/order',{
            templateUrl:'tpl/order.html'
        })
        .when('/order/:dishId',{
            templateUrl:'tpl/order.html',
            controller:'orderDetail'
        })
        .when('/myOrder',{
            templateUrl:'tpl/myOrder.html',
            controller:'myOrderCtrl'
        })
        .otherwise({redirectTo:'/start'})
});