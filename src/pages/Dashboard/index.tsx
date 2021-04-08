import { useState, useEffect } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodFields {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

export function Dashboard() {
  const [foods, setFoods] = useState<FoodFields[]>([]);
  const [editingFood, setEditingFood] = useState<FoodFields>({} as FoodFields);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  useEffect(() => {
    async function loadFoods() {
      const response = await api.get('/foods');
      setFoods(response.data);
    }
    loadFoods();
  }, []);
  
  async function handleAddFood(food: FoodFields) {
    const response = await api.post('/foods', {
      ...food,
      available: true,
    })

    setFoods([...foods, response.data]);
  }

  async function handleUpdateFood(food: FoodFields) {

    const foodUpdated = await api.put(
      `/foods/${editingFood.id}`,
      {
        ...editingFood,
        ...food
      },
    );

    const foodsUpdated = foods.map(f => f.id !== foodUpdated.data.id ? f : foodUpdated.data);

    setFoods(foodsUpdated);
  }

  const handleDeleteFood = async (foodId: number) => {
    await api.delete(`/foods/${foodId}`);

    const foodsFiltered = foods.filter(food => food.id !== foodId);
    setFoods(foodsFiltered)
  };

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: FoodFields) {
    setEditingFood(food)
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food, index) => (
            <Food
              key={index}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
