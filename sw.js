// Imports
importScripts('js/sw-utils.js');

const  STATIC_CACHE = 'static-v1';
const  DYNAMIC_CACHE = 'dynamic-v1';
const  INMUTABLE_CACHE = 'inmutable-v1';


const APP_SHELL = [
     '/',
    'index.html',
    'style/base.css',
    'js/base.js',
    'js/sw-utils.js',
    'js/app.js'
];

const APP_SHELL_INMUTABLE = [
    'https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];


self.addEventListener( 'install', e => {
    const cacheStatic = caches.open( STATIC_CACHE ).then( cache => 
        cache.addAll( APP_SHELL) );
   
    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then( cache => 
            cache.addAll( APP_SHELL_INMUTABLE ) );
           
           
    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]) );
});

self.addEventListener('activate', e => {

    const response =  caches.keys().then( keys =>{
        keys.forEach( key => {
            if ( key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

            if ( key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }

        });
    });
    
    e.waitUntil( response ); 
});

self.addEventListener('fetch', e => {
    
    const response = caches.match( e.request ).then( res => {

        if( res ){
            return res;
        } else {
            return fetch( e.request ).then( res_online => {
				return updateDinamycCache( DYNAMIC_CACHE, e.request, res_online );
            });
        }
    });
    
    e.respondWith( response );

});


