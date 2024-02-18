import z from "zod"


const registerSchema= z.object({
    email:z.string().email("Invalid email!.."),
    username:z.string().min(4, 'Username must be at least 4 characters'), 
})