

export const routes = [
    {
        path:"/errorBook",
        name:"errorBook",
        component: ()=> import("@/view/errorBook.vue")
    },
    {
        path:"/example",
        name:"example",
        component: ()=> import("@/view/corePart.vue")
    }
] 