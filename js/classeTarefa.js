import { quantityTask,optionsTask } from "./main.js"

class Tarefas{
    constructor(){
        this.todas = []
        this.ativas = []
        this.completas = []
        this.boxTask = document.querySelector(".box-task__items")
        this.boxTaskChildren = Array.from(this.boxTask.children)
        this.semTarefa = document.querySelector("#no-task")
    }
    
    #adicionarTaskEstado(tasks, text){
        this.boxTask.replaceChildren()
        if(tasks.length !== 0){
            tasks.forEach(item => {
                this.boxTask.appendChild(item)
            })
        } else {
            this.semTarefa.innerHTML = `<h3 class=content__noTask>${text}</h3>`
            this.boxTask.appendChild(this.semTarefa)
        }   
    }

    #mostrarMensagemSemTarefa(){
        const stateTask = Array.from(optionsTask)
            .find(item => item.classList.contains("list__selected")).innerHTML
        const messagesStateTask = {
            All:"There are no tasks here!",
            Active:"There are no active tasks!",
            Completed:"There are no completed tasks!"
        }

        this.semTarefa.innerHTML = `<h3 class=content__noTask>${messagesStateTask[stateTask]}</h3>`
        this.boxTask.appendChild(this.semTarefa)
    }

    adicionar(nome){       
        this.boxTaskChildren = Array.from(this.boxTask.children)
        if(this.boxTaskChildren.includes(this.semTarefa)){
            this.boxTask.removeChild(this.semTarefa) 
        } 

        const nomeNormalizado = nome.trim().toLowerCase()
        if(!this.boxTaskChildren.some(item => item.innerText.trim().toLowerCase() == nomeNormalizado) || this.boxTask.length === 0){
            this.boxTask.innerHTML += `
            <div class="items__content" draggable="true">
                <div class="content__taskname">
                    <input type="checkbox" id="check">
                    <label for="check" class="taskname__check"><i class="fa-solid fa-check"></i></label>
                    <label for="check">${nome}</label>
                </div>
                <i class="fa-solid fa-xmark content__delete"></i>
            </div>
                    `
            this.todas = Array.from(this.boxTask.children)
            this.ativas = Array.from(this.boxTask.children)
                .filter(item => !(item.children[0].children[1].classList.contains("concluded")))
            quantityTask()
        }
    }

    remover(element){
        this.boxTaskChildren = Array.from(this.boxTask.children)
        const arrTask = this.boxTaskChildren.filter(item => item !== element)
        this.boxTask.replaceChildren()
        arrTask.forEach(item => {
            this.boxTask.appendChild(item)  
        })

        if(arrTask.length === 0){
            this.#mostrarMensagemSemTarefa()
        }

        this.ativas = this.ativas.filter(item => item != element)
        this.todas = this.todas.filter(item => item != element)
        this.completas = this.completas.filter(item => item != element)

        quantityTask()
    }

    limpar(){
        this.completas = []
        this.ativas = []
        this.todas = []
        this.boxTask.innerHTML = ""
        this.#mostrarMensagemSemTarefa()
        quantityTask()
    }

    marcarConcluida(element){
        const parent = element.parentNode.parentNode
        if(element.classList.contains("concluded")){
            this.ativas = this.ativas.filter(item => item != parent)
            this.completas.push(parent)
        } else {
            this.completas = this.completas.filter(item => item != parent)
            this.ativas.push(parent)
        }
    }

    selecionarEstadoTask(element){
        if(element.innerHTML === "All"){
            this.#adicionarTaskEstado(this.todas, "There are no tasks here!")
        } else if(element.innerHTML === "Active"){
            this.#adicionarTaskEstado(this.ativas, "There are no active tasks!")
        } else if(element.innerHTML === "Completed"){
            this.#adicionarTaskEstado(this.completas, "There are no completed tasks!")
        }
    }

    reoganizarTarefas(newTaskOrder){
        const state = document.querySelector(".list__selected")
        state.innerHTML === "All" ? this.todas = newTaskOrder : null
        state.innerHTML === "Active" ? this.ativas = newTaskOrder : null
        state.innerHTML === "Completed" ? this.completas = newTaskOrder : null
    }
}


export default new Tarefas()