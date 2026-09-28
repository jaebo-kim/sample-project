export async function getPayment(paymentId, repository) {
  return repository.findById(paymentId);
}
