'use client'
import React, { Fragment } from 'react'
import { Category } from '@/payload-types'


const SelectCategoryMenu: React.FC<{ categories: Category[]; level?: number }> = ({ categories, level = 0 }) => {

  let indentCategory =''
  for(let i=0;i<=level;i++) {
    if( level === 0) {
      continue
    }
    if (level === 1) {
      indentCategory = "&nbsp;&nbsp;"
      break
    }
    indentCategory += '&nbsp;&nbsp;&nbsp;'
  }
  const OptionString = (option: string) => {
    return indentCategory + option


  }
  return (
    <>
        {categories && categories.map((category) => (
          <Fragment key={category.id}>
            <option style={{
              fontWeight: level === 0 || level === 1 ? 'bold' : 'normal',
              textAlign: 'left',
              textTransform: level === 0 ? 'uppercase' : 'inherit',
              fontSize: level === 0 ? '14px' : 'inherit',
              backgroundColor: 'white',
            }}
              className={`p-1 text-euroestetic`}
              value={category.slug as string}
                    dangerouslySetInnerHTML={{__html: OptionString(category.title)}}
            />

            {category.subcategories && category.subcategories.length > 0 && (
              <SelectCategoryMenu categories={category.subcategories as Category[]} level={level + 1} />
            )}
          </Fragment>
        ))}
    </>
  )
    ;
};
export default SelectCategoryMenu
