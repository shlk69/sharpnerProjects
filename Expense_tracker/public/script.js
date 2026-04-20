
const BASE_URL = 'http://localhost:8000/users/signup'


const form = document.getElementById('signupForm')
form.addEventListener('submit', async (e) => {
    e.preventDefault()
   try {
     const userData = {
         name:document.getElementById('name').value,
         email:document.getElementById('email').value,
         password:document.getElementById('password').value
     }
     const response = await fetch(BASE_URL, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body:JSON.stringify(userData)
     })
     const result = await response.json()
     if (response.ok) {
         console.log('Sign-up success',result)
     } else {
         console.log('Sign-up failed',result)
     }
   } catch (error) {
    console.log(error)
   }
})