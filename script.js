import * as Variables from "./variables.js";

//clear temporary diaries in local storage
(function(){
    localStorage.removeItem('diary-temp')
})()

Variables.renderDate();

//render diary items
Variables.renderAllDiaryItems();

//start to analyze after clicking analyze button
Variables.analyzeBtn.addEventListener('click', (e)=>{
    if(!Variables.inputField.value){
        alert('Input field cannot be empty');
        return
    }else{
    Variables.hideResults();
    Variables.getSentiment(Variables.inputField.value);} 
})

Variables.inputField.addEventListener('keypress', (e)=>{
    if(e.key !== 'Enter')return 
    if(!Variables.inputField.value){
        alert('Input field cannot be empty');
        return
    }else{
    Variables.hideResults();
    Variables.getSentiment(Variables.inputField.value);} 
})

//add to archive 
Variables.addToArchiveBtn.addEventListener('click', (e)=>{
    const tempDiaries = JSON.parse(localStorage.getItem('diary-temp'));
    const curDiaryObject = tempDiaries[tempDiaries.length - 1];

    Variables.setLocalStorage(curDiaryObject);
    Variables.inputField.value = "";
    Variables.inputField.focus();
    Variables.addToArchiveBtn.setAttribute('disabled', 'disabled');
    Variables.modalAnimation();
    Variables.renderDiaryItem(curDiaryObject)
                 
});

//delete item
Variables.gallery.addEventListener('click', (e)=>{
    if(e.target.classList.contains('fa-trash-can')){
        const curItem = e.target.parentElement;
        Variables.showModal(Variables.modalDeleteDiary)

        Variables.modalDeleteDiary.addEventListener('click', (e)=>{
            if(e.target.classList.contains('modal__delete')){
                Variables.diaryObjects.forEach((o, i, arr)=>{
                if(o.id === curItem.getAttribute('id')){
                    arr.splice(i, 1);
                    curItem.remove();
                    localStorage.setItem('diaries', JSON.stringify(arr))}
                }) 
                Variables.closeModal(Variables.modalDeleteDiary) 
            }else{
                Variables.closeModal(Variables.modalDeleteDiary);
            }
        })     
    };  
})


//open diary modal
Variables.gallery.addEventListener('click', (e)=>{
    if(e.target.classList.contains('display__diaryItem')){
         const curEl = e.target;
         const curOb = Variables.diaryObjects.find((o,i)=>{
             return o.id === curEl.getAttribute('id')
         })
         Variables.openDiaryItemModal(curOb);
         
    }
})
//close diary modal
Variables.closeDiaryModalBtn.addEventListener('click', (e)=>{
    Variables.closeModal(Variables.diaryItemModal)
})

//search diary item
Variables.diarySearchBtn.addEventListener('click', (e)=>{
    if(!Variables.diarySearchBar.value){
        alert('Input field cannot be empty');
        return
    }else{
        Variables.searchDiaryItem(Variables.diarySearchBar.value);
    }
})

Variables.diarySearchBar.addEventListener('keypress', (e)=>{
    if(e.key !== 'Enter') return 
    if(!Variables.diarySearchBar.value){
        alert('Input field cannot be empty');
        return
    }else{
        Variables.searchDiaryItem(Variables.diarySearchBar.value);
    }
})

//smooth scrolling
Variables.headerBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    Variables.section1.scrollIntoView({behavior: 'smooth'})
})
