export const inputField = document.getElementById('user-input');
export const result = document.querySelector('.item__result');
export const valence = document.querySelector('.result__main-container');
export const details = document.querySelector('.result__details');
export const negative = document.getElementById('num-negative');
export const neutral = document.getElementById('num-neutral');
export const positive = document.getElementById('num-positive');
export const date = document.querySelector('.item__date');
export const dateNum = document.querySelector('.item__date-num');
export const loader = document.getElementById('loader');
export const valueStr = document.querySelector('.result__main-value');
export const addToArchiveBtn = document.getElementById('add-to-archive');
export const analyzeBtn = document.getElementById('start-analysis');
export const addToArchiveModal = document.getElementById('modal-add-to-archive');
export const overlay = document.querySelector('.overlay');
export const gallery = document.getElementById('gallery');
export const deleteBtn = document.getElementById('delete-btn');
export const diaryItemModal = document.getElementById('modal-display-diary');
export const section1 = document.getElementById('section--1');
export const section2 = document.getElementById('section--2');
export const closeDiaryModalBtn = document.getElementById('close-diary-modal-btn');
export const diaryModalTitle1 = document.getElementById('text-1');
export const diaryModalTitle2 = document.getElementById('text-2');
export const diaryModalContent = document.getElementById('modal-main-content');
export const diarySearchBtn = document.getElementById('btn-search-diary');
export const diarySearchBar = document.getElementById('diary-search-bar')
export const headerBtn = document.getElementById('header-btn');
export const modalDeleteDiary = document.getElementById('modal-comfirm-delete');
export const modalDeleteDiaryYesBtn = document.getElementById('modal-delete-yes');
export const modalDeleteDiaryNoBtn = document.getElementById('modal-delete-no');



//render current date
export const renderDate = function(){
    const dateStr = new Date().toLocaleDateString();
    dateNum.textContent = dateStr;
    return dateStr
}



//create diary item object
export function Diary(input, val){
    this.content = input;
    this.valence = val;
    this.id = (Date.now() + "").slice(-10);
    this.date = renderDate()
}

//add to local storage
export const getLocalStorage = function(keyStr){
    try{
        const diaryObs = JSON.parse(localStorage.getItem(keyStr));
        return (diaryObs ? diaryObs : [])
    }catch(err){
        console.error(err.message)
        return []
    }
}

let diaryTemp = getLocalStorage('diary-temp');
//get diaries from local storage
export let diaryObjects = getLocalStorage('diaries');

export const setLocalStorage = function(diaryOb){
    diaryObjects.push(diaryOb);
    localStorage.setItem('diaries', JSON.stringify(diaryObjects))
}

export const renderAllDiaryItems = function(){
    if(diaryObjects[0])
        diaryObjects.forEach((ob)=>{
        renderDiaryItem(ob)
})
}

//decide valence's word color
export const decideColor = function(sentiment){
    if(sentiment === 'neutral'){
        return 'green'
    }
    else if(sentiment === 'positive'){
        return 'var(--font-positive)'
    }
    else return 'red'
    
}

export const renderResult = function(resultData){
    //hide loader
    loader.classList.add('u-display-none');
    valueStr.textContent = resultData.sentiment;
    valueStr.style.color = decideColor(resultData.sentiment);
    valueStr.classList.remove('u-display-none');

   //display result string
    const {neg, neu, pos} = resultData.sentiment_list[0];
    negative.textContent = (neg * 100).toFixed(1) + '%';
    neutral.textContent = (neu * 100).toFixed(1) + '%';
    positive.textContent = (pos * 100).toFixed(1) + '%';
    details.style.opacity = 1;
}

export const getSentiment = async function(input){
    try{
       const s =  "{\"language\":\"english\"" + "," + "\"text\":" + "\"" + input + "\"" + "}";
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': '8212341a06msh116c63045407b15p1bffecjsn3f8fe6a12567',
                'X-RapidAPI-Host': 'text-analysis12.p.rapidapi.com'
            },
            body: s
        };
        const res = await fetch('https://text-analysis12.p.rapidapi.com/sentiment-analysis/api/v1.1', options)
        if(!res.ok) throw new Error('Something went wrong:( Please try again');
        const data = await res.json();
        
        renderResult(data)
       
        addToArchiveBtn.removeAttribute('disabled');
 
        const newDiaryOb = new Diary(input, data.sentiment);
        diaryTemp.push(newDiaryOb);
        localStorage.setItem('diary-temp', JSON.stringify(diaryTemp));
       
    }catch(err){
        alert('Something went wrong:( Please try again')
    }
}

export const showModal = function(modal){
    modal.classList.remove('u-display-none');
    overlay.classList.remove('u-display-none');
}

export const closeModal = function(modal){
    modal.classList.add('u-display-none');
    overlay.classList.add('u-display-none');
}

export const modalAnimation = function(){
    showModal(addToArchiveModal);
    setTimeout(()=>{closeModal(addToArchiveModal)
    }, 1000)
}

export const hideResults = function(){
    valueStr.classList.add('u-display-none');
    loader.classList.remove('u-display-none');
    details.style.opacity = 0;
}

export const renderDiaryItem = function(diaryObject){
    let html = `
    <div class="display__diaryItem" id=${diaryObject.id}>
        <i class="fa-solid fa-trash-can top-right-btn" id="delete-btn"></i>
        <div class="diaryItem__text">${diaryObject.content.length > 80 ? diaryObject.content.slice(0, 79) + "..." : diaryObject.content}</div>
        <div class="diaryItem__box-container">
            <span class="diaryItem__box-icon">${diaryObject.valence === 'negative' ? '<i class="fa-solid fa-cloud-sun-rain" style="color: var(--icon-rain)"></i>' : '<i class="fa-solid fa-sun" style="color: var(--icon-sun)"></i>'}</span>
            <span class="diaryItem__box-date">${diaryObject.date}</span>
        </div>
    </div>`;
    gallery.insertAdjacentHTML('afterbegin', html)

}

//open diary item modal
export const openDiaryItemModal = function(ob){
    diaryModalTitle1.textContent = ob.date;
    diaryModalTitle2.textContent = ob.valence;
    diaryModalContent.textContent = ob.content;
    showModal(diaryItemModal)
}

//search content
export const searchDiaryItem = function(text){
    gallery.innerHTML = "";
    diaryObjects.forEach((ob, i)=>{
        const entries = Object.entries(ob);
        
        for(const [key, value] of entries){
            if(value.includes(text)){ 
                renderDiaryItem(ob)
                break
            }
        }
    })
    if(!gallery.firstElementChild){
    gallery.insertAdjacentText('beforeend', 'No result :(');
    setTimeout(()=>{
        gallery.innerHTML = "";
        renderAllDiaryItems();
    },3000)
    }

}

//alert when user trying to delete note


//sort diary item by date


