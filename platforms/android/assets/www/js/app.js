angular.module('todo', ['ionic', 'firebase', 'todo.services'])

.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate, $firebase) {
  var ref = new Firebase("https://learnindatfirebase.firebaseio.com/projects");

  $scope.projects = $firebase(ref).$asArray();
    
  $scope.projects.$loaded(function(data){
    if($scope.projects.length == 0) {
      while(true) {
        var projectTitle = prompt('Your first project title:');
        if(projectTitle) {
          createProject(projectTitle);
          break;
        }
      }
    }
    $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];
  });

  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);

    $scope.projects.$add(newProject);
      
    $scope.selectProject(newProject, $scope.projects.length-1);

  }

  $scope.newProject = function() {
    var projectTitle = prompt('Project name');
    if(projectTitle) {
      createProject(projectTitle);
    }
  };

  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  }

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.createTask = function(task) {
    if(!task) {
      return;
    }
    var index = _.findIndex($scope.projects, {title: $scope.activeProject.title});
    if(index === -1)
      return;
    if(!$scope.projects[index].tasks){
      $scope.projects[index].tasks = [];
    }
    $scope.projects[index].tasks.push({
      title: task.title
    });
    $scope.projects[index] = angular.copy($scope.projects[index]);
    $scope.projects.$save(index);
 
     
    $scope.taskModal.hide();
    task.title = "";
  };
  $scope.checkOffTask = function(task){
    var index = _.findIndex($scope.projects, {title: $scope.activeProject.title});
    var taskIndex = _.findIndex($scope.projects[index].tasks, {title: task.title});
    $scope.projects[index].tasks[taskIndex].checkedOff = true;
    $scope.projects[index] = angular.copy($scope.projects[index]);
    $scope.projects.$save(index);

  };
  $scope.editTask = function(task){
    $scope.task = task;
     $scope.taskModal.show();
  };
  $scope.deleteTask = function(task){
    var index = _.findIndex($scope.projects, {title: $scope.activeProject.title});
    _.remove($scope.projects[index].tasks, {title: task.title});   
    $scope.projects[index] = angular.copy($scope.projects[index]);
    $scope.projects.$save(index);
  }

  $ionicModal.fromTemplateUrl('templates/new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope
  });

})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

