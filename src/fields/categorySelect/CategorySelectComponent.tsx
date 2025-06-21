import * as React from 'react';
import { SelectInput, useField } from '@payloadcms/ui'
import { Category } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

type Option = {
  label: string;
  value: string;
}
interface CustomSelectProps{
  path: string;
  options:Option[];
}
const CategoriesSelectComponent: React.FC<CustomSelectProps> = ({ path, options }) => {
  const { value, setValue } = useField<string>({ path });
  const [newOptions, setNewOptions] = React.useState<Option[]>([]);

  // Fetch options on component mount
  React.useEffect(() => {
    const fetchOptions = async () => {
      // try {
      //   const response = await fetch('https://restcountries.com/v3.1/all');
      //   const data = await response.json();
      //
      //   const countryOptions = data.map((country) => {
      //     return {
      //       label: `${country.name.common + ' ' + country.flag}`,
      //       value: country.name.common,
      //     };
      //   });
      //
      //   setOptions(countryOptions.sort(
      //     (a, b) => a.label.localeCompare(b.label)
      //   ));
      // } catch (error) {
      //   console.error('Error fetching data:', error);
      // }
      const payload = await getPayload({ config: configPromise })
      const categoriesResult = await payload.find({
        collection: 'categories',
      })

      const categories: Category[] = categoriesResult.docs
      const categoryOptions = categories.map((category) => {
        return {
          label: `${category.title + ' ' + category.parent}`,
          value: category.id.toString(),
        };
      });
      setNewOptions(categoryOptions)
      // setOptions(categoryOptions.sort(
      //   (a, b) => a.label.localeCompare(b.label)
      // ));

    };

    fetchOptions().then();
  }, []);

  return (
    <div>
      <label className='field-label'>
        Categorías
      </label>
      <SelectInput
        path={path}
        name={path}
        options={newOptions}
        value={value}
        //@ts-ignore
        onChange={(e) => setValue(e.value)}
      />
    </div>
  )
};

export default CategoriesSelectComponent