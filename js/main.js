
import tarefas from "./classeTarefa.js"

const iconMode = document.querySelector("#icon")
const boxTask = document.querySelector(".box-task__items")

const changeMode = () => {
    document.querySelector("html").classList = (localStorage.getItem("theme") || "")
    iconMode.classList.toString() === "fa-solid fa-moon" ? iconMode.classList = "fa-solid fa-sun" : iconMode.classList = "fa-solid fa-moon" 
}

if(localStorage.getItem("theme")){
    changeMode()
}

iconMode.addEventListener("click", () => {
    localStorage.getItem("theme") === "dark-mode" ? localStorage.removeItem("theme") : localStorage.setItem("theme", "dark-mode")
    changeMode()
}) // Aplicando Dark Mode

const form = document.querySelector("#form")
form.addEventListener("submit", (e) => {
    e.preventDefault()
    const inputTarefas = document.querySelector("#inputText")
    if(inputTarefas.value.trim() !== ""){
        tarefas.adicionar(inputTarefas.value)
        inputTarefas.value = ""
        addEventDelete()
        addEventCheck()
    }
}) // Adicionando as tarefas

const addEventDelete = () => {
    const iconRemove = document.querySelectorAll(".content__delete")
    iconRemove.forEach(item => {
        item.addEventListener("click", () => {
            tarefas.remover(item.parentElement)
        }) 
    })
}

//  colocando evento de click para remover

const addEventCheck = () => {
    const check = document.querySelectorAll(".taskname__check")
    check.forEach(item => {
        item.addEventListener("click", (e) => {
            item.classList.toggle("concluded")
            tarefas.marcarConcluida(e.currentTarget)
        })
    })
}

// colocando evento de click para concluir

const clear = document.querySelector("#clear")
clear.addEventListener("click", () => {
    tarefas.limpar()
})

const quantityTask = () => {
    const quantityTask = document.querySelector("#itemsLeft")
    const boxTaskChildren = Array.from(boxTask.children).filter(item => !item.hasAttribute("id"))
    quantityTask.innerHTML = `${boxTaskChildren.length} items left`
}

// limpar tudo e contar tarefas

const optionsTask = document.querySelectorAll(".option-task")
optionsTask.forEach(item => {
    item.addEventListener("click", (e) => {
        optionsTask.forEach(item => item.classList.remove("list__selected"))
        e.currentTarget.classList.add("list__selected")
        tarefas.selecionarEstadoTask(e.currentTarget)
        quantityTask()
    })
})

// Segmenta as tarefas por estado

const dragNdrop = () => {
    document.addEventListener("dragstart", (e) => {
        e.target.classList.add("draggin")
    })
    
    document.addEventListener("dragend", (e) => {
        e.target.classList.remove("draggin")
    })
    
    boxTask.addEventListener("dragover", (e) => {
        e.preventDefault()
        const taskChild = Array.from(e.currentTarget.querySelectorAll(".items__content:not(.draggin)")) 
    
        if(taskChild.includes(e.target)){
    
            const draggin = document.querySelector(".draggin")
            const taskCenter = e.target.getBoundingClientRect()
    
            if(draggin){
                if(e.clientY < taskCenter.y + (taskCenter.height / 2)){
                    e.target.insertAdjacentElement("beforebegin",draggin)
                } else{
                    e.target.insertAdjacentElement("afterend",draggin)
                }

                tarefas.reorganizarTarefas(Array.from(boxTask.children))
            }
        }
    })
}


const mediaDesktop = matchMedia("(min-width:1366px)")

if(mediaDesktop.matches) dragNdrop()

mediaDesktop.addEventListener("change", () => {
    if(mediaDesktop.matches) dragNdrop()
})

// drag and drop

const mediaMobile = window.matchMedia("(max-width:760px)")

mediaMobile.addEventListener("change", () => {
    const menuTask = document.querySelectorAll(".menu")
    menuTask.forEach(item => {
        for(let itemOP of item.children){
            itemOP.classList.remove("list__selected")
        }
    })
    menuTask.forEach(item => item.firstElementChild.classList.add("list__selected"))

    tarefas.selecionarEstadoTask(menuTask[0].firstElementChild)
})

// voltando para as tarefas de "all" toda vez que mudar a resolução de mobile para desktop    

const observer = new MutationObserver((mutations) => {
    mutations.forEach(item => {
        if(item.target.scrollHeight > item.target.clientHeight){
            item.target.style.overflowY = "scroll"
        } else {
            item.target.style.overflowY = "hidden"
        }
    })
})

const config = {childList:true}

observer.observe(boxTask,config)

// reagindo a adição e remoção de elementos para colocar overflow

export { quantityTask,optionsTask }