/*console.log('hola mundo!');
const noCambia = "Leonidas";

let cambia = "@LeonidasEsteban"

function cambiarNombre(nuevoNombre) {
  cambia = nuevoNombre
}
//PROMESAS!!!
const getUserAll = new Promise(function(todoBien, todoMal) {
  //Llamar a un api
  //setInterval
  setTimeout(function(){
    todoBien('se acabo el tiempo 5')
  }, 5000)
})
const getUser = new Promise(function(todoBien, todoMal) {
  //Llamar a un api
  //setInterval
  setTimeout(function(){
    todoBien('se acabo el tiempo 3')
  }, 3000)
})

// getUser
//   .then(function() {
//     console.log('todo esta bien en la vida')
//   })
//   .catch(function(message) {
//     console.log(message)
//   })

Promise.all([
// Promise.race - para una carrera de cual acaba primero
  getUser,
  getUserAll
])
.then(function(message){
  console.log(message)
})
.catch(function(message){
  console.log(message)
})


$.ajax('https://randomuser.me/api/', {
  method: 'GET',
  success: function(data) {
    console.log(data)
  },
  error: function(error){
    console.log(error)
  }
})
//https://randomuser.me
//XMLHttpRequest

fetch('https://randomuser.me/api/')
  .then(function(response) {
    // console.log(response)
    return response.json()
  })
  .then(function (user) {
    console.log('user', user.results[0].name.first)
  })
  .catch(function(){
    console.log('algo falló')
  });
*/

(async function load() {
  async function getData(url) {
        const response = await fetch(url)
        const data = await response.json()
        if (data.data.movie_count > 0) {
          return data
        }
        throw new Error('No se encontro ningun resultado')
      }

  const $form = document.getElementById('form')
  const $home = document.getElementById('home')
  const $featuringContainer = document.getElementById('featuring')

  //PARA RECORDAR EL METODO O PROCESO agregar atributos CSS a un HTML (img)
  function setAttributes($element, attributes) {
        for(const attribute in attributes) {
          $element.setAttribute(attribute, attributes[attribute])
  }}

  function featuringTemplate(peli) {
        return (
          `
          <div class="featuring">
            <div class="featuring-image">
              <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
            </div>
            <div class="featuring-content">
              <p class="featuring-title">Pelicula encontrada</p>
              <p class="featuring-album">${peli.title}</p>
            </div>
          </div>
          `
        )
  }
  const BASE_API = 'https://yts.lt/api/v2/'
  $form.addEventListener('submit', async (event) => {
        // debugger
        event.preventDefault() //no se me reinicia supongo el texto escrito
        $home.classList.add('search-active')
        const $loader = document.createElement('img') //Creamos HTML -> img
        setAttributes($loader, {
          src: 'src/images/loader.gif',
          height : 50,
          width: 50
        })
        $featuringContainer.append($loader) //agregamos al final del HTML
        const data = new FormData($form); //Todo el contenido del formulario guardado en data
        //const peli = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)
        //Destructuracion de objetos
        try {
          const {
            data: {
              movies: pelis
            }
          } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)
          const HTMLString = featuringTemplate(pelis[0]) //PARA MEMO
          $featuringContainer.innerHTML = HTMLString;
        } catch(error) {
          alert(error.message)
          $loader.remove()
          $home.classList.remove('search-active')
        }
  })

  // let terrorList;
  // getData('https://yts.lt/api/v2/list_movies.json?genre=terror')
  //   .then(function(data) {
  //     console.log('terrorList', data);
  //     terrorList = data;
  //   })




  function videoItemTemplate(movie, category){
        return (
          `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category=${category}>
            <div class="primaryPlaylistItem-image">
              <img src="${movie.medium_cover_image}">
            </div>
            <h4 class="primaryPlaylistItem-title">
              ${movie.title}
            </h4>
          </div>`
        )
  }
  function createTemplate(HTMLString) {
        const html = document.implementation.createHTMLDocument();
        html.body.innerHTML = HTMLString;
        return html.body.children[0]
  }
  // console.log(videoItemTemplate('src/images/covers/bitcoin.jpg','bitcoin'));
  function addEventClick($element) {
        $element.addEventListener('click',() => {
          // alert('Click! =D')
          showModal($element)
        })
  }
  function renderMovieList(list, $container, category) {
        //actionList.data.movies
        $container.children[0].remove(); //adios loader.gif
        list.forEach((movie) => {
          const HTMLString =videoItemTemplate(movie, category)
          const movieElement = createTemplate(HTMLString)
          $container.append(movieElement)
          const image = movieElement.querySelector('img')
          image.addEventListener('load', (event) => {
              event.srcElement.classList.add('fadeIn')
          })
          addEventClick(movieElement)
        })
  }

  async function cacheExist(category) {
    const listName = `${category}List`
    const cacheList = window.localStorage.getItem(listName)
    if (cacheList) {
      return JSON.parse(cacheList) //transforma texto en objetos, quita comillas
    }
    const { data: { movies: data } } = await getData(`${BASE_API}list_movies.json?genre=${category}`)
    window.localStorage.setItem(listName, JSON.stringify(data))
    return data
  }
  // const {data: {movies : actionList}} = await getData(`${BASE_API}list_movies.json?genre=action`)
  const actionList = await cacheExist('action');
  //window.localStorage.setItem('actionList', JSON.stringify(actionList)
  const $actionContainer = document.querySelector('#action')
  renderMovieList(actionList, $actionContainer, 'action')
  // Ejm en JQuery const $home = $('.home .list #item')
  //js - getElementByClassName() getElementByTagName()[]
  // document.querySelector('.modal') - Trae el 1er elemento que encuentra
  // document.querySelectoraLL('.modal') - Trae todos los elementos que coincidan

  const dramaList = await cacheExist('drama');
  const $dramaContainer = document.getElementById('drama')
  renderMovieList(dramaList, $dramaContainer, 'drama')

  const animationList = await cacheExist('animation');
  const $animationContainer = document.getElementById('animation')
  renderMovieList(animationList, $animationContainer, 'animation')

  const $modal = document.getElementById('modal')
  const $overlay = document.getElementById('overlay')
  const $hideModal = document.getElementById('hide-modal')
  //document.querySelector('#modal img')
  const $modalImage = $modal.querySelector('img')
  const $modalTitle = $modal.querySelector('h1')
  const $modalDescription = $modal.querySelector('p')

  function findById(list, id) {
    return list.find(movie => movie.id === parseInt(id, 10))
    debugger
  }
  function findMovie(id, category) {
    switch (category) {
      case 'action': { return findById(actionList, id) }
      case 'drama': { return findById(dramaList, id) }
      case 'animation': { return findById(animationList, id) }
    }
  }
  function showModal($element) {
        $overlay.classList.add('active')
        $modal.style.animation = 'modalIn .8s forwards'
        const id = $element.dataset.id
        const category = $element.dataset.category
        const data = findMovie(id, category)
        $modalImage.setAttribute('src', data.medium_cover_image)
        $modalTitle.textContent = data.title
        $modalDescription.textContent = data.description_full
  }
  $hideModal.addEventListener('click',hideModal)
  function hideModal () {
        $overlay.classList.remove('active')
        $modal.style.animation = 'modalOut .8s forwards'
  }
  })()
  //se auto-ejecuta
  //https://yts.am.api
  //Reto!!! https://randomuser.me
