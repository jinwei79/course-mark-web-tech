<template>
    <div>
        <button @click="openModal">Add User</button>
        <div v-if="showModal" class="modal-overlay">
            <div class="modal-content">
                <h2>Add User</h2>
                <form @submit.prevent="addUser">
                    <div>
                        <label for="name">Name:</label>
                        <input id="name" v-model="user.name" required />
                    </div>
                    <div>
                        <label for="email">Email:</label>
                        <input id="email" v-model="user.email" type="email" required />
                    </div>
                    <div>
                        <label for="role">Role:</label>
                        <select id="role" v-model="user.role" required>
                            <option value="" disabled>Select role</option>
                            <option value="lecturer">Lecturer</option>
                            <option value="advisor">Advisor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div class="modal-actions">
                        <button type="button" @click="closeModal" class="button-danger">Cancel</button>
                        <button type="submit">Add</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AddUserModal',
    data() {
        return {
            showModal: false,
            user: {
                name: '',
                email: '',
                role: ''
            }
        }
    },
    methods: {
        openModal() {
            this.showModal = true
        },
        closeModal() {
            this.showModal = false
            this.user = { name: '', email: '', role: '' }
        },
        addUser() {
            
            if (!this.user.name || !this.user.email || !this.user.role) {
                alert("Please fill in all fields.")
                return
            }

            fetch('http://localhost:8080/users', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.user)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add user')
                }
                return response.json()
            })
            .then(data => {
                console.log('User added successfully:', data)
                this.closeModal()
                this.$emit('userAdded', data);
            })
            .catch(error => {
                console.error('Error adding user:', error)
                alert('Error adding user: ' + error.message)
            })

        }
    }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
}
.modal-content {
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    min-width: 600px;
}
.modal-actions {
    margin-top: 2rem;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

input, select {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.modal-content h2 {
    margin-bottom: 1rem;
}
.modal-content label {
    display: block;
    margin-bottom: 0.5rem;
}
.modal-content div {
    margin-bottom: 1rem;
}
</style>