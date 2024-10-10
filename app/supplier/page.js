'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_BASE+ '/supplier'
function App() {
  
  const [suppliers, setSuppliers] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
  })
  const [editingSupplier, setEditingSupplier] = useState(null)

  // Fetch all suppliers from the backend when the component loads
  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(API_URL)
      setSuppliers(response.data) // Set the fetched suppliers to state
    } catch (error) {
      console.error('Failed to fetch suppliers:', error)
    }
  }

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submit (either add or update)
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSupplier) {
        // Update supplier in backend
        const response = await axios.put(API_URL, {
          _id: editingSupplier._id,
          ...formData,
        })
        // Update supplier in state
        setSuppliers((prev) =>
          prev.map((supplier) =>
            supplier._id === editingSupplier._id ? response.data : supplier
          )
        )
        setEditingSupplier(null)
      } else {
        // Add new supplier to backend
        const response = await axios.post(API_URL, formData)
        // Add new supplier to state
        setSuppliers((prev) => [...prev, response.data])
      }
      resetForm()
    } catch (error) {
      console.error('Failed to submit supplier:', error)
    }
  }

  // Edit supplier (set the form to edit mode)
  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      address: supplier.address,
      phoneNumber: supplier.phoneNumber,
    })
  }

  // Delete a supplier from the backend and update the state
  const handleDeleteSupplier = async (id) => {
    try {
      await axios.delete(API_URL, { data: { _id: id } })
      // Remove the deleted supplier from state
      setSuppliers((prev) => prev.filter((supplier) => supplier._id !== id))
    } catch (error) {
      console.error('Failed to delete supplier:', error)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      phoneNumber: '',
    })
    setEditingSupplier(null)
  }

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <h1 className='text-4xl font-bold text-center text-gray-800 mb-8'>Suppliers</h1>

      {/* Form for Adding/Editing Suppliers */}
      <div className='max-w-xl mx-auto bg-white p-6 shadow-md rounded-lg'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <input
              type='text'
              name='name'
              placeholder='Supplier Name'
              value={formData.name}
              onChange={handleChange}
              required
              className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>
          <div>
            <input
              type='text'
              name='address'
              placeholder='Address'
              value={formData.address}
              onChange={handleChange}
              required
              className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>
          <div>
            <input
              type='text'
              name='phoneNumber'
              placeholder='Phone Number'
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>
          <div className='flex space-x-4'>
            <button
              type='submit'
              className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300'
            >
              {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
            </button>
            {editingSupplier && (
              <button
                type='button'
                onClick={resetForm}
                className='w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300'
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List of Suppliers */}
      <div className='max-w-3xl mx-auto mt-8'>
        <ul className='space-y-4'>
          {suppliers.map((supplier) => (
            <li key={supplier._id} className='bg-white p-4 shadow-md rounded-lg'>
              <div className='flex justify-between items-center'>
                <div>
                  <p className='font-semibold text-gray-800'>
                    Name: {supplier.name}
                  </p>
                  <p className='text-gray-600'>Address: {supplier.address}</p>
                  <p className='text-gray-600'>Phone: {supplier.phoneNumber}</p>
                </div>
                <div className='space-x-2'>
                  <button
                    onClick={() => handleEditSupplier(supplier)}
                    className='bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-300'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSupplier(supplier._id)}
                    className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300'
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
