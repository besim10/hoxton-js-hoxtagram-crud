// write your code here

const imgContainer = document.querySelector('.image-container')

const state = {
    cards: []
}

function getCards(){
    return fetch('http://localhost:3000/images').then(function(resp){
        return resp.json()
    })
}
getCards().then(function(cardsFromServer){
    state.cards = cardsFromServer
    render()
})
function updateCardOnServer(card) {
    return fetch(`http://localhost:3000/images/${card.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(card)
    })
}

function createCommentOnServer(title,imgId){
    return fetch('http://localhost:3000/comments',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: title,
            imageId: imgId
        })
    }).then(function (resp) {
    return resp.json()
  })
}

function deleteCommentFromServer(id) {
    return fetch(`http://localhost:3000/comments/${id}`, {
      method: 'DELETE'
    })
}
function deleteCardFromServer(id) {
    return fetch(`http://localhost:3000/images/${id}`, {
      method: 'DELETE'
    })
}
function deleteCardFromState(card){
    const updatedCards = state.cards.filter(function(target){
      return target.id != card.id
    })
    state.cards = updatedCards
  }

function renderCards(){

    imgContainer.innerHTML = ''

    for(const card of state.cards){
    
    const articleEl = document.createElement('article')
    articleEl.setAttribute('class','image-card')

    const h2El = document.createElement('h2')
    h2El.setAttribute('class','title')
    h2El.textContent = card.title

    const deletePostButton = document.createElement('button')
    deletePostButton.setAttribute('class','post-delete-button')
    deletePostButton.textContent = 'X'

    deletePostButton.addEventListener('click',function(){

        deleteCardFromState(card)

        deleteCardFromServer(card.id) 

        render()
    })
    

    const imgEl = document.createElement('img')
    imgEl.setAttribute('class','image')
    imgEl.setAttribute('src',`${card.image}`)

    const divEl = document.createElement('div')
    divEl.setAttribute('class','likes-section')

    const spanEl = document.createElement('span')
    spanEl.setAttribute('class','likes')
    spanEl.textContent = `${card.likes} likes`

    const buttonEl = document.createElement('button')
    buttonEl.setAttribute('class','like-button')
    buttonEl.textContent = 'Like ❤'

    buttonEl.addEventListener('click',function(){
        
        card.likes++
        
        updateCardOnServer(card)

        render()
    })
    const ulEl = document.createElement('ul')
    ulEl.setAttribute('class','comments')

    for(const comment of card.comments){

        const liEl = document.createElement('li')
        liEl.setAttribute('class','comment-list')
        liEl.textContent = `${comment.content}`

        const deleteButton = document.createElement('button')
        deleteButton.setAttribute('class','comment-delete-button')
        deleteButton.textContent = 'Delete'
        
        deleteButton.addEventListener('click',function(){

            card.comments = card.comments.filter((target) => target !== comment)

            deleteCommentFromServer(comment.id)
            
            render()

        })

        ulEl.append(liEl,deleteButton)

    }
    
    const formEl = document.createElement('form')
    formEl.setAttribute('class','comment-form')

    const inputEl = document.createElement('input')
    inputEl.setAttribute('class','comment-input')
    inputEl.setAttribute('type','text')
    inputEl.setAttribute('name','comment')
    inputEl.setAttribute('placeholder','Add a coment...')

    const formButton = document.createElement('button')
    formButton.setAttribute('class','comment-button')
    formButton.setAttribute('type','submit')
    formButton.textContent = `Post`

    formEl.addEventListener('submit', function (event) {
        event.preventDefault()
        const currentIndex = state.cards.indexOf(card)
        
        const title = formEl.comment.value
        
        if(title !== ''){
            createCommentOnServer(title,card.id)
            .then(function (commentFromServer) {
              state.cards[currentIndex].comments.push(commentFromServer)
              render()
              formEl.reset()
            })
        }
        else{
            alert('Please type something!!!')
        }
    })
    

    imgContainer.append(articleEl)
    articleEl.append(h2El, imgEl, divEl, ulEl,formEl)
    divEl.append(spanEl, buttonEl)
    formEl.append(inputEl, formButton)
    h2El.append(deletePostButton)

    }
}



function render(){
    renderCards()
}
render()