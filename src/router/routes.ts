


export const routes = [
    {
        path:"/" ,
        component: ()=> import('../view/HomePage.vue'),
        name: 'home'
    },
    {
        path:"/login" ,
        component: ()=> import('../view/HomePage.vue'),
        name:"login"
    },
    {
        path:"/show/:id?/:function?" ,
        component: ()=> import('../view/corePart.vue'),
        name:"start",
        props:true
    }
]