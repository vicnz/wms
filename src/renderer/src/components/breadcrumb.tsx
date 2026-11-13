import { useNavigate } from 'react-router-dom'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from './ui/breadcrumb'
import React from 'react'
type UrlTrailing = {
  title: string
  url?: string
  active?: boolean
}

export function PageBreadcrumb(props: { breadcrumb?: Array<UrlTrailing> }) {
  const { breadcrumb } = props
  const navigate = useNavigate()
  return (
    <>
      <Breadcrumb className="w-fit">
        <BreadcrumbList className="w-fit">
          {breadcrumb?.map((item, idx) => {
            if (idx === breadcrumb?.length - 1) {
              return (
                <BreadcrumbItem key={idx}>
                  <BreadcrumbPage className={'truncate w-1/3 md:w-full'}>
                    {item.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              )
            } else {
              return (
                <React.Fragment key={idx}>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink onClick={() => navigate(item.url ?? '/')}>
                      {item.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </React.Fragment>
              )
            }
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  )
}
