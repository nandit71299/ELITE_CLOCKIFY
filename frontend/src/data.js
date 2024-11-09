import apiUtil from "./utils/apiUtil";

let clients = [];

const getClients = async () =>
  await apiUtil.fetchAllClients().then((clientData) => {
    if (clientData) {
      clients = clientData;
    }
  });

getClients();

export const clientsData = clients;

// export const clientsData = [
//   {
//     id: 1,
//     name: "Client 1",
//     projects: [
//       {
//         id: 1,
//         projectTitle: "Project 1",
//         taskGroups: [
//           {
//             id: 1,
//             groupName: "Task Group 1",
//             color: "#FF5733",
//             tasks: [
//               {
//                 id: 1,
//                 taskTitle: "Task 1",
//                 timers: [
//                   {
//                     startTime: null,
//                     endTime: null,
//                   },
//                 ],
//               },
//               {
//                 id: 2,
//                 taskTitle: "Task 2",
//                 timers: [
//                   {
//                     startTime: null,
//                     endTime: null,
//                   },
//                 ],
//               },
//             ],
//           },
//           {
//             id: 2,
//             groupName: "Task Group 2",
//             color: "#33FF57",
//             tasks: [
//               {
//                 id: 3,
//                 taskTitle: "Task 3",
//                 timers: [
//                   {
//                     startTime: null,
//                     endTime: null,
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 2,
//     name: "Client 2",
//     projects: [
//       {
//         id: 2,
//         projectTitle: "Project 2",
//         taskGroups: [
//           {
//             id: 3,
//             groupName: "Task Group 1",
//             color: "#3357FF",
//             tasks: [
//               {
//                 id: 4,
//                 taskTitle: "Task 4",
//                 timers: [
//                   {
//                     startTime: null,
//                     endTime: null,
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ];
