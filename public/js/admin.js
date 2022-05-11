const deleteProduct = async (button) => {
  const productId = button.parentNode.querySelector('[name=productId]').value;
  const csrf = button.parentNode.querySelector('[name=_csrf]').value;
  const productElement = button.closest('article');

  try {
    const response = await (await fetch(`/admin/product/${productId}`, {
      method: 'DELETE',
      headers: {
        'csrf-token': csrf
      }
    })).json()

    productElement.parentNode.removeChild(productElement);
    console.log({ response });
  } catch (e) {
    console.log(e);
  }

};
