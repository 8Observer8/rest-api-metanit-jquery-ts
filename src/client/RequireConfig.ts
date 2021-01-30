requirejs.config({
    baseUrl: "js",
    paths: {
        "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min"
    }
});

requirejs(["main"], () => { });