import React, { useState,useMemo } from 'react'
import { useTable,useSortBy,usePagination,useGlobalFilter } from 'react-table'
import datas from './data.json'
import {AiFillHeart,AiFillDelete,AiOutlineClose} from 'react-icons/ai'
import {BiCaretLeft,BiCaretRight} from 'react-icons/bi'

const ReactTable = () => {
    
    const tabColumns = [
        {
          Header: "Car Image",
          accessor: "images",
          enableSorting:false,
          Cell: ({ cell: { value } }) => (
            <img
              src={value}
              alt="NO-IMG-LOAD"
              onClick={() => handleModalOpen(true)}
              width={50} height={50}
            ></img>
          ),
        },
        {
          Header: "Car Name",
          accessor: "make",
        },
        {
          Header: "Model",
          accessor: "model",
        },
        {
          Header: "Year Of Manufacture",
          accessor: "year",
        },
        {
          Header: "Mileage",
          accessor: "mileage",
        },
        {
          Header: "Status",
          accessor: "status",
          Cell: ({ cell: { value } }) => (
            <span
              className={`carstatus ${
                value === "Sold Out" ? "soldout" : "available"
              }`}
            >
              {value}
            </span>
          ),
        },
        {
          Header: "Favorite",
          accessor: "isFavorite",
          Cell: ({ row }) => (
            <button
              className="text-red-600 text-xl"
              onClick={() => favHandler(row.original)}
            >
              <AiFillHeart/>
            </button>
          ),
        },
      ];

      const favHandler = (e) => {
        setData((prev) => {
          return [...prev.filter((car) => car.id !== e.id)];
        });
        setFav((prev) => {
          console.log(...prev, e);
          return [...prev, e];
        });
      };

      const removeFav = (item) => {
        setData((prev) => {
          return [...prev, item];
        });
        setFav((prev) => {
          return [...prev.filter((car) => car.id !== item.id)];
        });
      };

      
      const [data, setData] = useState(datas.vehicles);
      const [fav, setFav] = useState([]);
      const [isModel, setIsModel] = useState(false);
      const [singleData, setSingleData] = useState([]);
      const handleModalOpen = (value) => {
        setIsModel(value);
      };
    const columns= useMemo(() => tabColumns, []);
    const table = useTable(
        {
          columns,
          data: data,
          initialState: {
            pageSize: 10,
            pageIndex: 0,
          },
        },
        useGlobalFilter,
        useSortBy,
        usePagination,
        
      );
    const { getTableProps,getTableBodyProps,headerGroups,page,prepareRow,canPreviousPage,canNextPage,pageOptions,nextPage,previousPage,state,setPageSize,state: { pageIndex, pageSize },setGlobalFilter } = table;

    const handleRowClick = (row) => {
        setSingleData(row.original)
      };

      const { globalFilter } = state;
    return (
    <>
     
    <div className='container flex mx-auto gap-3 py-10'>
        <div className='w-3/4'>
        <div className='mb-2'>
        <input type='text' className='w-[250px] p-3 rounded-full outline-none ' value={globalFilter || ''} onChange={e=>setGlobalFilter(e.target.value)}placeholder='Search Filter'/>
      </div>
        <table className='w-full mb-3 border-b-2' {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr className='text-white bg-[#362F4B] ' {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className='p-[10px]'
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr className="odd:bg-white even:bg-[#eaeaea]" {...row.getRowProps()} onClick={() => handleRowClick(row)}>
                {row.cells.map((cell) => {
                  return (
                    <td className='p-[10px] text-center' {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      

      <div className="navArea flex justify-between">
      <select className="pageSelect outline-none"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[10, 15, 25, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize !== 100 ? `Show ${pageSize}` : `Show all`}
            </option>
          ))}
        </select>
        <div className='flex'>
          
          <button className="p-2  bg-gray-200  rounded-tl-lg rounded-bl-lg"onClick={() => previousPage()} disabled={!canPreviousPage}>
          {<BiCaretLeft/>}
          </button>
          <span className='p-2  text-xs bg-gray-200  border-x-2 border-white'>
          Page&nbsp;
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
          <button  className="p-2  bg-gray-200 rounded-tr-lg rounded-br-lg" onClick={() => nextPage()} disabled={!canNextPage}>
          {<BiCaretRight/>}
          </button>
          
        </div>
        
      </div>
      </div>
      <div className='w-1/4 mt-[55px]'>
        <h3 className='p-[10px] font-semibold text-white bg-[#362F4B]'>Favorite List</h3>
        {console.log(fav.length)}
        {fav.length > 0 ? fav.map((fav) => (
        <div className='flex h-[80px] bg-white mt-2'>
            <div className='w-1/4'>
                <img src={fav.images} alt="NofavImg"className='w-full h-full'/>
            </div>
            <div className='flex  flex-col w-3/4 px-2'>
                <span className='w-full font-semibold'>{fav.make} - {fav.model}</span>
                <span className='w-full'>{fav.year}</span>
                <span className='w-full flex justify-end cursor-pointer'><button onClick={() => removeFav(fav)}><AiFillDelete/></button></span>
            </div>
        </div>
        )): <p className='text-center text-gray-400'>No Favorite Added</p>}
      </div>
      </div>
      {isModel ? <div className='modelArea'>
        <div className='w-1/4 bg-white p-3'>
        <div className='modelHeader flex justify-end text-2xl text-gray-400'> <AiOutlineClose onClick={()=>setIsModel(false)}/></div>
        <div className='flex flex-col'>
        <div className='modelImage p-2'><img src={singleData.images}/></div>
        <div className='modelContent'>
            <p className='flex justify-between'><span>Car Name: {singleData.make}</span> <span>Model: {singleData.model}</span></p>
            <p className='flex justify-between'><span>Year:{singleData.year}</span> <span>Mileage:{singleData.mileage}</span></p>
            <p className='bg-red-700 text-center text-white p-2 my-3 rounded-md'>{singleData.price}</p>
        </div>
        </div>
        
        </div>
      </div>:null}
      
      </>
    )
}

export default ReactTable