pragma solidity ^0.4.18;
//pragma experimental 'ABIEncoderV2';



contract Field {

//    struct Cell {
//        uint y;
//        uint x;
//        uint color;
////        address delegate; // person delegated to
//    }

    uint[] filledX;
    uint[] filledY;
    uint[] filledColors;

//    uint LENGTH = 1000;
//    Cell[1000] private filledCells;

//    uint index = 0;

//    event cellFilled(Cell cell);

    function fillCell(uint x, uint y, uint color) public {
//        Cell memory newFilledCell;
//
//        newFilledCell.x = x;
//        newFilledCell.y = y;
//        newFilledCell.color = color;
//
//        if (index > LENGTH - 1) {
//            filledCells[index++] = newFilledCell;
//        }

        filledX.push(x);
        filledY.push(y);
        filledColors.push(color);
    }

    function getFilledCells() public view returns (uint[], uint[], uint[]) {
        return (filledX, filledY, filledColors);

//        return filledCells;
    }
}
