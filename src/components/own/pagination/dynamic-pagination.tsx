import React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsisLeft,
  PaginationEllipsisRight,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface DynamicPaginationProps {
  totalPages: number
  currentPage: number
  onChange: (page: number) => void
  className?: string
}

export default function DynamicPagination({ totalPages, currentPage, onChange, className }: DynamicPaginationProps) {

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) onChange(page)
  }

  const getVisiblePages = () => {
    if (totalPages <= 7) return [...Array(totalPages)].map((_, i) => i + 1)

    if (currentPage <= 4) return [1, 2, 3, 4, 5, totalPages]

    if (currentPage > 4 && currentPage < totalPages - 3)
      return [1, currentPage - 1, currentPage, currentPage + 1, totalPages]

    return [
      1,
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }

  const visiblePages = getVisiblePages()

  const isAtStart = currentPage === 1
  const isAtEnd = currentPage === totalPages

  return (
    <Pagination className={cn("w-full", className)}>
      <PaginationContent>

        {/* Páginas con popovers */}
        {visiblePages.map((page, index) => {
          const prevPage = visiblePages[index - 1]
          const nextPage = visiblePages[index + 1]

          const showLeftEllipsis =
            index === 1 && page - (prevPage ?? 0) > 1

          const showRightEllipsis =
            index === visiblePages.length - 2 &&
            (nextPage ?? 0) - page > 1

          return (
            <React.Fragment key={page}>

              {/* POPUP IZQUIERDO */}
              {showLeftEllipsis && (
                <PaginationItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <PaginationEllipsisLeft />
                    </PopoverTrigger>

                    {(() => {
                      const missingPages = Array.from(
                        { length: page - prevPage - 1 },
                        (_, i) => prevPage + i + 1
                      )

                      const count = missingPages.length
                      const columns = Math.min(count, 5)
                      const rows = Math.ceil(count / 5)
                      const width = columns * 48 + (columns - 1) * 8

                      return (
                        <PopoverContent
                          className="p-2 bg-input/30"
                          style={{ width }}
                        >
                          <ScrollArea className={cn("rounded-md", rows >= 4 && "h-32 pr-4")}>
                            <div
                              className="grid gap-2"
                              style={{
                                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                              }}
                            >
                              {missingPages.map((missing) => (
                                <Button
                                  variant="blue"
                                  key={missing}
                                  size="sm"
                                  onClick={() => handlePageChange(missing)}
                                >
                                  {missing}
                                </Button>
                              ))}
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      )
                    })()}
                  </Popover>
                </PaginationItem>
              )}

              {/* Página normal */}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(page)
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>

              {/* POPUP DERECHO */}
              {showRightEllipsis && (
                <PaginationItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <PaginationEllipsisRight />
                    </PopoverTrigger>

                    {(() => {
                      const missingPages = Array.from(
                        { length: nextPage - page - 1 },
                        (_, i) => page + i + 1
                      )

                      const count = missingPages.length
                      const columns = Math.min(count, 5)
                      const rows = Math.ceil(count / 5)
                      const width = columns * 48 + (columns - 1) * 8

                      return (
                        <PopoverContent
                          className="p-2 bg-input/30"
                          style={{ width }}
                        >
                          <ScrollArea className={cn("rounded-md", rows >= 4 && "h-32 pr-4")}>
                            <div
                              className="grid gap-2"
                              style={{
                                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                              }}
                            >
                              {missingPages.map((missing) => (
                                <Button
                                  variant="blue"
                                  key={missing}
                                  size="sm"
                                  onClick={() => handlePageChange(missing)}
                                >
                                  {missing}
                                </Button>
                              ))}
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      )
                    })()}
                  </Popover>
                </PaginationItem>
              )}

            </React.Fragment>
          )
        })}

        {/* Botón anterior */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className={isAtStart ? "opacity-50 pointer-events-none" : ""}
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(currentPage - 1)
            }}
          />
        </PaginationItem>

        {/* Botón siguiente */}
        <PaginationItem>
          <PaginationNext
            href="#"
            className={isAtEnd ? "opacity-50 pointer-events-none" : ""}
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(currentPage + 1)
            }}
          />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  )
}
