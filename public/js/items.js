localStorage.setItem('cart',JSON.stringify([]))

const items = document.querySelectorAll('.item')
items.forEach(item =>{
    item.querySelector('.add').addEventListener('click',()=>{
        item.querySelector('.count').innerHTML =  parseInt(item.querySelector('.count').innerHTML) + 1
        if(localStorage.getItem('cart')){
            let cart = JSON.parse(localStorage.getItem('cart'))
            cart.push(item.querySelector('#id').value)
            localStorage.setItem('cart',JSON.stringify(cart))
        }else{
            let cart = []
            cart.push(item.querySelector('#id').value)
            localStorage.setItem('cart',JSON.stringify(cart))
        }
        document.querySelector('.cart').value = localStorage.getItem('cart')
    })
    item.querySelector('.sub').addEventListener('click',()=>{
        if(parseInt(item.querySelector('.count').innerHTML) > 0){
        item.querySelector('.count').innerHTML =  parseInt(item.querySelector('.count').innerHTML) - 1
            let cart =  JSON.parse(localStorage.getItem('cart'))
            let index = cart.indexOf(item.querySelector('#id').value)
            cart.splice(index,1)
            localStorage.setItem('cart',JSON.stringify(cart))
        }
        document.querySelector('.cart').value = localStorage.getItem('cart')
    })
} )