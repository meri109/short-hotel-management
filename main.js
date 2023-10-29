class Backdrop{
    constructor(clickHandler){
        this.backdropEl = document.querySelector('.backdrop')
        this.backdropEl.onclick = clickHandler
    }

    open(){
        this.backdropEl.classList.add('backdrop-open')
    }
    close(){
        this.backdropEl.classList.remove('backdrop-open')
    }
}


class Modal{
    constructor(className){
        this.className = className
        this.backdrop = new Backdrop()
        this.modal = document.querySelector('.' + className)
        this.xButtonEl = this.modal.lastElementChild
        this.exitButtonEl = this.modal.lastElementChild.previousElementSibling.lastElementChild
        this.xButtonEl.onclick = this.closeModal
        this.exitButtonEl.onclick = this.closeModal
        this.backdrop = new Backdrop(this.closeModal)

    }

    openModal = () => {
        this.backdrop.open()
        this.modal.classList.add('modal-open')
    }

    closeModal = () => {
        this.backdrop.close()
        this.modal.classList.remove('modal-open')
    }

}
class FormItem{
    constructor(element){
        this.element = element
        this.errorElement = this.element.nextElementSibling
        this.hasError = false
    }
    setError = (message) =>{
        this.element.classList.add('error')
        this.errorElement.textContent = message
        this.hasError =true
    }
    clearError = ()=>{
        this.element.classList.remove('error')
        this.errorElement.textContent = ''
        this.hasError = false
    }

    get hasValue(){
        return Boolean(this.element.value)
    }
}

class InputController extends FormItem{

}

class SelectController extends FormItem{
    constructor(element){
        super(element)
        this.element.onchange = this.changeHandler
    }
    changeHandler=()=>{
        console.log(this.element.value);
    }
}

class PositiveNumberInputController extends InputController{
    constructor(element){
        super(element)
        this.element.oninput = this.changeHandler
        this.value = ''
    }

    changeHandler =()=>{
        const newValue = this.element.value
        if(/^\d*$/.test(newValue)){
            this.value =newValue
            this.clearError()
        }else{
            this.element.value = this.value
            this.setError('Only digits')
        }
    }

}

class AddRoomModal extends Modal{
    constructor(parent){
        super('add-room-modal')
        this.parent = parent
        this.newRoomButton = document.querySelector('.new-room-button')
        this.newRoomButton.onclick = this.openModal
        this.form = document.querySelector('.add-room-modal form')
        this.numberInput = new PositiveNumberInputController(this.form[0])
        this.floorInput = new PositiveNumberInputController(this.form[1])
        this.typeSelect = new SelectController(this.form[2])
        this.priceInput = new PositiveNumberInputController(this.form[3])
        this.formItems = [this.numberInput, this.floorInput, this.typeSelect, this.priceInput]
        this.saveButton = document.querySelector('.add-room-modal .save')
        this.saveButton.onclick = this.saveHandler

    }
    checkValidity = () => {
        for(let formItem of this.formItems){
            if(formItem.hasError){
                return false
            } else if (!formItem.hasValue){
                formItem.setError('You should fill this area!')
                return false
            }
        }  
        return true
    }
    saveHandler = () => {
        if (this.checkValidity()) {
            const info = {
                price: this.priceInput.value,
                floor: this.floorInput.value,
                type: this.typeSelect.value,
                number: this.numberInput.value
            }
            this.parent.addRoom(info)
        }else {
            console.log('there are empty spaces');
        }
    }
}

class Table{
    constructor(){
        this.tableEl = document.querySelector('.main-table')
        this.tbodyEl = document.querySelector('.main-body')
        this.addRoomModal = new AddRoomModal(this)
        this.rooms = []
        this.loadRoomsFromLocalStorage();
    }

    get getRoomCount() {
        return this.rooms.length
    }

    saveRoomsToLocalStorage() {
        localStorage.setItem('rooms', JSON.stringify(this.rooms));
      }

    loadRoomsFromLocalStorage() {
        const roomsData = localStorage.getItem('rooms');
        if (roomsData) {
          this.rooms = JSON.parse(roomsData);
    
          // Render the rooms in the table (you need to implement this function)
          this.renderRooms();
        }
      }
    

    addRoom(info){
        this.rooms.push(info)
        this.saveRoomsToLocalStorage();
        const roomElement = `
            <td>${this.getRoomCount + 1}</td>
            <td>${info.number}</td>
            <td>${info.floor}</td>
            <td><i class="fa-solid fa-check"></i></td>
            <td>${info.type}</td>
            <td>12.12.12</td>
            <td>Leyla Aliyeva</td>
            <td>${info.price} AZN</td>
            <td><i class="fa-solid fa-circle-plus button"></i></td>
            <td><i class="fa-solid fa-circle-minus button"></i></td>
            <td><i class="fa-solid fa-trash button"></i></td>
        `
        const tr = document.createElement('tr')
        tr.innerHTML = roomElement
        this.tbodyEl.appendChild(tr)
        this.addRoomModal.closeModal()
    }
    
}

// const table = new Table()

Table.prototype.renderRooms = function() {
    // Clear the existing table content
    this.tbodyEl.innerHTML = "";

    // Loop through the rooms and create table rows for each room
    this.rooms.forEach((room, index) => {
        const roomElement = `
            <td>${index + 1}</td>
            <td>${room.number}</td>
            <td>${room.floor}</td>
            <td><i class="fa-solid fa-check"></i></td>
            <td>${room.type}</td>
            <td>12.12.12</td>
            <td>Leyla Aliyeva</td>
            <td>${room.price} AZN</td>
            <td><i class="fa-solid fa-circle-plus button"></i></td>
            <td><i class="fa-solid fa-circle-minus button"></i></td>
            <td><i class="fa-solid fa-trash button"></i></td>
        `;

        const tr = document.createElement('tr');
        tr.innerHTML = roomElement;
        this.tbodyEl.appendChild(tr);
    });
};

const table = new Table();
table.loadRoomsFromLocalStorage(); // Load and render rooms from local storage
