


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
    }
]