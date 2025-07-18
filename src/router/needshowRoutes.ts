

export const routes = [
    {
        path:"/show/:function",
        name:"errorBook",
        component: ()=> import("@/view/errorBook.vue")
    },
    {
        path:"/show/:function",
        name:"example",
        component: ()=> import("@/view/corePart.vue"),
        title:"样例一",
        description:"这是一个将题库转换后的样例页面，供用户查看最终的效果"
    }
] 