// controllers/list.controller.js
const List = require('../models/list');
const Board = require('../models/board'); // Asegúrate de que la ruta sea correcta

exports.createList = async (req, res) => {
  try {
    const { title } = req.body;
    const { boardId } = req.params;

    // Crea la nueva lista
    const newList = await List.create({ title, cards: [] });

    // Agrega el ID de la nueva lista al array 'lists' del tablero
    const updatedBoard = await Board.findByIdAndUpdate(
      boardId,
      { $push: { lists: newList._id } },
      { new: true }
    );

    // Verifica si el tablero fue encontrado y actualizado correctamente
    if (!updatedBoard) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Envía la respuesta con la lista creada y el tablero actualizado
    res.status(201).json({ list: newList, board: updatedBoard });
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).json({ message: 'Error creating list' });
  }
};

  

exports.deleteList = async (req, res) => {
  try {
    const { listId } = req.params;
    await List.findByIdAndDelete(listId);
    res.status(200).json({ message: 'List deleted successfully' });
  } catch (error) {
    console.error('Error deleting list:', error);
    res.status(500).json({ message: 'Error deleting list' });
  }
};

exports.updateList = async (req, res) => {
  try {
    const { listId } = req.params;
    const { title } = req.body;
    console.log(listId, title)
    const updatedList = await List.findByIdAndUpdate(listId, { title }, { new: true });
    res.status(200).json(updatedList);
  } catch (error) {
    console.error('Error updating list:', error);
    res.status(500).json({ message: 'Error updating list' });
  }
};

exports.createCard = async (req, res) => {
  try {
    const { title } = req.body;
    const { listId } = req.params;

    // Crea un nuevo objeto solo con el título de la tarjeta
    const newCard = { title };

    // Actualiza la lista con la nueva tarjeta
    const updatedList = await List.findByIdAndUpdate(
      listId,
      { $push: { cards: newCard } },
      { new: true }
    );
    
    res.status(201).json(updatedList);
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(500).json({ message: 'Error creating card' });
  }
};

  

exports.deleteCard = async (req, res) => {
  console.log(req.params, '<<<<<--->>>>>')
  try {
    const { listId, cardId } = req.params;
    console.log(listId, cardId, '<<<<<--->>>>>')
    const updatedList = await List.findByIdAndUpdate(listId, { $pull: { cards: { _id: cardId } } }, { new: true });
    res.status(200).json(updatedList);
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ message: 'Error deleting card' });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const { listId, cardId } = req.params;
    const { title } = req.body;
    const updatedList = await List.findOneAndUpdate(
      { _id: listId, "cards._id": cardId },
      { $set: { "cards.$.title": title } },
      { new: true }
    );
    res.status(200).json(updatedList);
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ message: 'Error updating card' });
  }
};

exports.reorderLists = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { newListOrder } = req.body;

    // Obtener el tablero de la base de datos
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    // Modificar el orden de las listas
    board.lists = newListOrder;

    // Guardar los cambios en el tablero
    const updatedBoard = await board.save();

    res.status(200).json({ message: 'Lists reordered successfully', board: updatedBoard });
  } catch (error) {
    console.error('Error reordering lists:', error);
    res.status(500).json({ message: 'Error reordering lists' });
  }
};


/* exports.reorderCards = async (req, res) => {
  try {
    const { listId } = req.params;
    const { cards } = req.body;

    // Actualiza la lista en la base de datos con el nuevo orden de las tarjetas
    const updatedList = await List.findByIdAndUpdate(listId, { cards }, { new: true });

    res.status(200).json({ message: 'Cards reordered successfully', list: updatedList });
  } catch (error) {
    console.error('Error reordering cards:', error);
    res.status(500).json({ message: 'Error reordering cards' });
  }
}; */


// Controlador para mover la tarjeta de una lista a otra
exports.moveCard = async (req, res) => {
  try {
    const { sourceListId, destinationListId, draggableId, destinationIndex } = req.body;

    // Encuentra la lista de origen en la base de datos
    const sourceList = await List.findById(sourceListId);

    // Encuentra la tarjeta a mover en la lista de origen
    console.log( sourceList,  ' <--------- este el id de la card' )
    const movedCardIndex = sourceList.cards.findIndex(card => card._id.toString() === draggableId);
    console.log( movedCardIndex,  ' <--------- esta es la card a mover' )
    const movedCard = sourceList.cards.splice(movedCardIndex, 1)[0];
    console.log(movedCard, '<---------')
    if (sourceListId === destinationListId) {
      // Si estamos moviendo la tarjeta dentro de la misma lista, simplemente insertamos en la nueva posición
      sourceList.cards.splice(destinationIndex, 0, movedCard);
      await sourceList.save();
    } else {
      // Si estamos moviendo la tarjeta a otra lista, encontramos la lista de destino en la base de datos
      const destinationList = await List.findById(destinationListId);
      // Insertamos la tarjeta en la lista de destino en la posición adecuada
      destinationList.cards.splice(destinationIndex, 0, movedCard);
      // Guardamos los cambios en ambas listas
      await sourceList.save();
      await destinationList.save();
    }

    res.status(200).json({ message: 'Card moved successfully' });
  } catch (error) {
    console.error('Error moving card:', error);
    res.status(500).json({ message: 'Error moving card' });
  }
};

