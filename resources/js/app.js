/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');
window.Vue = require('vue');
window._ = require('lodash');
window.$ = window.jQuery = require('jquery');
window.Bus = new Vue();
/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue').default);
/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
});
var notifications = [];
var NOTIFICATIONS_TYPE = {
    newuser: 'App\\Notifications\\NewUserNotification',
    follow: 'App\\Notifications\\UserFollowed',
}

$(document).ready(function () {


    if (window.Laravel.userId) {

        $.get('' + window.Laravel.url + '', function (data) {
            window.console.log(data);
            addNotification(data);

        });
       
        var channel = window.Echo.private(`App.User.${Laravel.userId}`);
        Pusher.logToConsole = true;
        window.console.log(channel);
        channel.notification((notification) => {
            window.console.log(notification);
            addNotification([notification]);
        });
    }
});
function addNotification(newNotification) {
    notifications = newNotification;
    // show only last 5 notifications
    window.console.log('notifications:' + notifications);
    notifications.slice(0, 5);
    showNotification(notifications);


}

function showNotification(notifications) {
    var notificationsWrapper = $('#notification_list');
    var notificationsToggle = notificationsWrapper.find('a.ttr-submenu-toggle');
    var notificationsCountElem = notificationsToggle.find('#count');
    var notificationsCount = parseInt(notificationsCountElem.data('count'));
    var notificationsList = notificationsWrapper.find('#notify');
    if (notifications.length) {
        var htmllist = notifications.map(function (notification) {
            window.console.log('notification:' + notification);
            return  makeNotification(notification);
        });
        var oldnotifictions = notificationsList.html();
        notificationsList.html(htmllist + oldnotifictions);
        notificationsCount = notificationsCount + 1;
        var text = notificationsCount + ' New';
        notificationsCountElem.attr('data-count', notificationsCount);
        notificationsWrapper.find('.ttr-notify-text-top').text(text);
        notificationsWrapper.find('#count').text(notificationsCount);


    } else {
        notificationsList.html(`
                     <li> 
                       <span class="new-users-top-text">
                               <span>No Notifications</span>
                         </span>
                     </li>`
                );

    }

}
function makeNotification(notification) {
    var to = routeNotifiction(notification);
    var listitem = NotificationItem(notification);
    return '<li>' + listitem + '</li>';

}

function routeNotifiction(notification) {
    var to = '?read' + notification.id;
    if (notification.type === NOTIFICATIONS_TYPE.follow) {
        to = 'user.' + to;
    } else if (notification.type === NOTIFICATIONS_TYPE.newuser) {

        to = 'user.' + to;
    }
    return '/' + to;
}

function NotificationItem(notification) {
    var NotificationHtml = '';

    if (notification.type === NOTIFICATIONS_TYPE.follow) {
        var message = 'followed You';
        NotificationHtml = `
                                                 <span class="new-users-top-text">
                                                                <span>` + notification.data.date + `</span>
                                                            </span>
                                                            <span class="new-users-pic">
                                                                <img src="assets/images/testimonials/pic1.jpg" alt=""/>
                                                            </span>
                                                            <span class="new-users-text">
                                                                <a href="#" class="new-users-name">` + notification.data.follower_name + `</a>
                                                                <span class="new-users-info">` + message + ` </span>
                                                            </span>
                                                            <span class="notification-time">
                                                              <a href="#" class="fa fa-close"></a>
                                                            </span>`;



    } else if (notification.type === NOTIFICATIONS_TYPE.newuser) {
        var message = 'Registration Now by ' + notification.data.user_email;

        NotificationHtml = `
                   <span class="new-users-top-text">
                       <span>` + notification.data.date + `</span>
                    </span>
                    <span class="new-users-pic">
                       <img src="assets/images/testimonials/pic1.jpg" alt=""/>
                    </span>
                     <span class="new-users-text">
                        <a href="#" class="new-users-name">` + notification.data.user_name + `</a>
                        <span class="new-users-info">` + message + ` </span>
                    </span>
                    <span class="notification-time">
                        <a href="#" class="fa fa-close"></a>
                        <span> 02:14</span>
                    </span>`;
    }

    return NotificationHtml;
}

