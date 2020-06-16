import React from 'react';
import { useRequest } from '@umijs/hooks';
function UseApiHook(promise, params = null) {
    const { data, loading } = useRequest(() => promise(params));

    return [data, loading]
}
export default UseApiHook; 