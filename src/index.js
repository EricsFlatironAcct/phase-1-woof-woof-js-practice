document.addEventListener('DOMContentLoaded', (event)=>{
    const filterButton = document.getElementById('good-dog-filter')
    const dogBarDiv = document.getElementById('dog-bar')
    const dogSummaryContainer = document.getElementById('dog-summary-container')
    const dogInfoDiv = document.getElementById('dog-info')
    const fetchURL = 'http://localhost:3000/pups'
    const dogLib = []
    let filterDogs = false
    fetch(fetchURL).then(resp=>resp.json()).then(dogs=>{
        for (const dog of dogs) dogLib.push(dog)
        debugger
        generateSpan()
        displayDoggo(1)
    })
    function generateSpan(){
        //clears current span
        while(dogBarDiv.hasChildNodes())dogBarDiv.removeChild(dogBarDiv.firstChild)
        //creates a new array, removes bad dogs if filter is true
        const filteredDogs = dogLib.filter((dog) =>{
            if(filterDogs) return dog.isGoodDog
            return true
        })
        //adds each dog to the span
        filteredDogs.forEach(dog =>{
            const newSpan = document.createElement('span')
            newSpan.id = dog.id
            newSpan.innerHTML = dog.name
            newSpan.addEventListener('click', (event)=> displayDoggo(event.target.id)) //Display dog when clicked
            dogBarDiv.append(newSpan)
        })
    }
    //Displays the selected dog
    function displayDoggo(id){
        while(dogInfoDiv.hasChildNodes()) dogInfoDiv.removeChild(dogInfoDiv.firstChild) //clears the current displayed dog
        const dogImg = document.createElement('img')
        dogImg.src = dogLib[id-1].image
        const dogName = document.createElement('h2')
        dogName.innerHTML = dogLib[id-1].name
        const dogButton = document.createElement('button')
        dogButton.setAttribute('class', id)
        dogButton.innerHTML = dogLib[id-1].isGoodDog ? 'Good Dog' : 'Bad Dog'
        dogButton.addEventListener('click', (event) =>{//switch good/bad
            const selectedDogID = event.target.getAttribute('class') //id stored in a class for simplicity
            dogLib[selectedDogID-1].isGoodDog = !dogLib[selectedDogID-1].isGoodDog //toggle goodness
            //patch change to database
            const patchObj = {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(dogLib[selectedDogID-1])
            }
            fetch(fetchURL+`/${selectedDogID}`, patchObj).then(resp =>resp.json()).then(dog=>{
                generateSpan() //udpate span
                displayDoggo(dog.id) // update displayed dog (button)
            })

        })
        //display dog
        dogInfoDiv.append(dogImg, dogName, dogButton)
    }
    //Toggles dog filter
    filterButton.addEventListener('click', (event)=>{
        filterDogs = !filterDogs
        event.target.innerHTML = 'Filter good dogs: '
        if (filterDogs) event.target.innerHTML += 'ON'
        else event.target.innerHTML += 'OFF'
        generateSpan()
    })
})