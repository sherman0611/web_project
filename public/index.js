navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
        console.log('SW registered: ', registration.scope);
    },(err) => {
        console.log('SW registration failed: ', err);
    })