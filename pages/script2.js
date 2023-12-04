
let arr = []
let LocalData;
let divamount = []
let buttonstatus = false
const productlist = () =>{

    fetch('/sendproduct',{
        headers:{'Accept': 'application/json', 'Content-Type':'application/json'},
        method:'post',
        body:JSON.stringify()
    })

    .then(res=>res.json())
    
    .then((data) => {
        LocalData = data
        if (buttonstatus == true) {
            document.getElementById('button').remove()
            document.getElementById('br').remove()
            
        }
        if (divamount.length != 0) {
            for (let i = 0; i < divamount.length; i++) {
                let element = document.getElementById(divamount[i])
                element.remove()
            }
        divamount = []
            
        }
        let status = document.getElementById('menu').value
        let input = document.getElementById('inpt').value
        if (status == 'name') {
            LocalData.sort((a, b) => {
                a = a.product.toLowerCase();
                b = b.product.toLowerCase();
            
                if (a < b) {
                    return -1;
                }
                if (a > b) {
                    return 1;
                }
                return 0;
            });
              
        }else if (status == 'price') {
            LocalData.sort((a,b)=>(a.price - b.price))
        }else if (input != 'search') {
            LocalData.forEach((val,ind) => {
                if (val.product.includes(input) == false) {
                    LocalData[ind] = 'skip'
                }
            });
        }
            
        
        for (let i = 0; i < data.length; i++) {
            if (data[i] == 'skip') {
                continue
            }   
                
            
            
            const div = document.createElement('div');
            div.addEventListener('click',(event)=>{
                arr.push(document.getElementById(`product${i}`).innerHTML)
            })
            document.getElementById('element').appendChild(div);
            div.setAttribute('id',`div${i}`);
            div.setAttribute('class','divs');
            const product = document.createElement('h2');
            product.innerHTML = data[i].product
            product.setAttribute('class','productC');
            product.setAttribute('id',`product${i}`);
            const price = document.createElement('p');
            price.innerHTML = data[i].price
            price.setAttribute('class','priceC');
            price.setAttribute('id',`price${i}`);
            document.getElementById(`div${i}`).appendChild(product);
            document.getElementById(`div${i}`).appendChild(price);
            divamount.push(`div${i}`)

            let st = document.getElementById(`div${i}`)
            st.className = 'products'
        }
        let br = document.createElement('br')
        br.setAttribute('id','br')
        document.getElementById('element').appendChild(br)
        let button = document.createElement('button');
        button.innerHTML = 'buy'
        button.setAttribute('id','button')
        button.onclick = buy

        document.getElementById('element').appendChild(button)
        buttonstatus = true
    })
    .catch((err)=>{
    })
}
productlist()
            
const buy = ()=>{
    let productArr = []
    arr.forEach((val) => {
        for (let i = 0; i < LocalData.length; i++) {
            if (val == LocalData[i].product) {
                productArr.push({product:LocalData[i].product,price:(LocalData[i].price)})
            }
            
        }
        
    });
    if (productArr.length == 0) {
        alert('no items selected')
    }else{
        fetch('/saveproduct',{
            headers:{'Accept': 'application/json', 'Content-Type':'application/json'},
            method:'post',
            body:JSON.stringify(productArr)
            
    
        })
        
        .then(res=>res.json())
        
        .then((data) => {
            localStorage.setItem('total',data.total)
            localStorage.setItem('price',data.price)
            location.href = 'http://localhost:3000/buy';
                
        })
        
        .catch((err)=>{
            
        })
    }

}

const load = () =>{
    let total = document.getElementById('total')
    let price = document.getElementById('price')
    let keytotal = localStorage.getItem('total')
    let keyprice = localStorage.getItem('price')
    total.innerHTML = 'total products '+keytotal
    price.innerHTML = 'total price '+keyprice

    
}











