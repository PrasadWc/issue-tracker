import { TableRow, TableCell, Skeleton, Box } from "@mui/material";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  hasAvatar?: boolean;
}

const TableSkeleton = ({
  columns,
  rows = 5,
  hasAvatar = false,
}: TableSkeletonProps) => {
  return (
    <>
      {Array.from(new Array(rows)).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from(new Array(columns)).map((_, colIndex) => (
            <TableCell key={colIndex}>
              {hasAvatar && colIndex === 0 ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    animation="wave"
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={20}
                      animation="wave"
                    />
                    <Skeleton
                      variant="text"
                      width="40%"
                      height={15}
                      animation="wave"
                    />
                  </Box>
                </Box>
              ) : (
                <Skeleton
                  variant="rounded"
                  height={24}
                  width={colIndex === columns - 1 ? 60 : "80%"}
                  animation="wave"
                  sx={{ borderRadius: "6px" }}
                />
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableSkeleton;
