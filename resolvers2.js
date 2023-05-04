import {db} from "./db2.js";

export const resolvers = {

    Query: {
        orders: async (_root, { status }) => 
        {
          try{
            const allorders = await db.getOrders();
            if(!allorders){
              console.log('No orders found');
              throw new Error('No orders found');
            }
            const rows = await db.getOrders();
            const filteredRows = rows.filter(row => row.status === status);
            const allOrders = filteredRows.map(row => ({
              id: row.id,
              deliveryAddress: row.deliveryAddress,
              items: row.items.split(',').map(item => item.trim()),
              total: row.total,
              discountCode: row.discountCode,
              comment: row.comment,
              status: row.status,
            }));
            console.log('Orders retrieved successfully');
            return allOrders;
          }catch (error){
            console.log('No orders found');
            throw new Error('No orders found');
          } 
        }
        ,
        order: async (_root, { id }) => {
          try{
            const gtorder = await db.getOrder(id);
            if (!gtorder || !gtorder.id ) {
                console.log(`No order found with id ${id}`);
                throw new Error(`No order found with id ${id}`);
              }
              console.log(`Order with id ${id} retrieved successfully`);
              return {...gtorder};
          }catch (error) {
            console.log(`No order found with id ${id}`);
            throw new Error(`No order found with id ${id}`);
          }
           
        },
      },

        Mutation: {
            updateStatus: async (_root, { input}) => {
               try{ 
                await db.updateOrderStatus(input.id, input.status);
                  const id = input.id;
                  const gtorder = await db.getOrder(id);
                  console.log(`Order with id ${input.id} updated successfully`);
                  return {...gtorder};
                }
                catch (error){  
                    console.log(`No order found with id ${input.id}`);
                    throw new Error(`No order found with id ${input.id}`);
                 }
            },
            createOrder: (_root, { input }) => 
            {
                try {
                    const newOrder =  db.insertOrder(input);
                    return newOrder;
                  } catch (error) {
                    console.log('Error creating order:', error);
                    throw new Error('Could not create order');
                  }
                }
            
        },

};

// module.exports = resolvers;