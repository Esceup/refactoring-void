import { useState } from 'react'
import type { ServiceItem } from '../types/types'
import { availableServices } from '../data'
import { MAX_QUANTITY, MIN_QUANTITY } from '../constants'

export default function ProjectBuilder() {
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([])
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  )
  const [quantity, setQuantity] = useState<number>(MIN_QUANTITY)
  const [error, setError] = useState<string | null>(null)

  const totalPrice = selectedServices.reduce(
    (sum, item) => sum + item.service.price * item.quantity,
    0
  )

  const addService = () => {
    setError(null)
    const service = availableServices.find((s) => s.id === selectedServiceId)
    if (!service) return

    if (!quantity || quantity < MIN_QUANTITY || quantity > MAX_QUANTITY) {
      setError(`Количество должно быть от ${MIN_QUANTITY} до ${MAX_QUANTITY}`)
      return
    }

    const existing = selectedServices.find(
      (item) => item.service.id === service.id
    )

    if (existing && existing.quantity + quantity > MAX_QUANTITY) {
      setError(`Превышен лимит в ${MAX_QUANTITY} единиц для одной услуги`)
      return
    }

    setSelectedServices((prev) => {
      if (existing) {
        return prev.map((item) =>
          item.service.id === service.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { service, quantity }]
    })

    setSelectedServiceId(null)
    setQuantity(MIN_QUANTITY)
  }

  const removeService = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.filter((item) => item.service.id !== serviceId)
    )
  }

  const increaseQuantity = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.map((item) => {
        if (item.service.id !== serviceId || item.quantity >= MAX_QUANTITY)
          return item
        return { ...item, quantity: item.quantity + 1 }
      })
    )
  }

  const decreaseQuantity = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.map((item) => {
        if (item.service.id !== serviceId || item.quantity <= MIN_QUANTITY)
          return item
        return { ...item, quantity: item.quantity - 1 }
      })
    )
  }

  return (
    <div
      className="project-builder"
      style={{
        maxWidth: 700,
        margin: '0 auto',
        fontFamily: 'sans-serif',
        padding: '20px',
      }}
    >
      <h2>Состав проекта</h2>

      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 24,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <select
          value={selectedServiceId ?? ''}
          onChange={(e) => {
            setSelectedServiceId(
              e.target.value === '' ? null : Number(e.target.value)
            )
            setError(null)
          }}
          style={{ padding: '8px 12px', fontSize: 14 }}
        >
          <option value="" disabled>
            Выберите услугу
          </option>
          {availableServices.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} — {service.price.toLocaleString()} ₽
            </option>
          ))}
        </select>

        <input
          type="number"
          min={MIN_QUANTITY}
          max={MAX_QUANTITY}
          value={quantity}
          onChange={(e) => {
            setQuantity(Number(e.target.value))
            setError(null)
          }}
          style={{ width: 80, padding: '8px 12px', fontSize: 14 }}
        />

        <button
          onClick={addService}
          disabled={!selectedServiceId}
          style={{
            padding: '8px 16px',
            fontSize: 14,
          }}
        >
          Добавить
        </button>
      </div>

      {error && (
        <div style={{ color: '#d33', fontSize: 14, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {selectedServices.length > 0 ? (
        <table
          className="services-table"
          style={{ width: '100%', borderCollapse: 'collapse' }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: 10,
                  textAlign: 'left',
                }}
              >
                Услуга
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: 10,
                  textAlign: 'left',
                }}
              >
                Цена за ед.
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: 10,
                  textAlign: 'left',
                }}
              >
                Кол-во
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: 10,
                  textAlign: 'left',
                }}
              >
                Сумма
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: 10,
                  textAlign: 'left',
                }}
              ></th>
            </tr>
          </thead>
          <tbody>
            {selectedServices.map((item) => (
              <tr key={item.service.id}>
                <td style={{ border: '1px solid #ddd', padding: 10 }}>
                  {item.service.name}
                </td>
                <td style={{ border: '1px solid #ddd', padding: 10 }}>
                  {item.service.price.toLocaleString()} ₽
                </td>
                <td style={{ border: '1px solid #ddd', padding: 10 }}>
                  <button
                    onClick={() => decreaseQuantity(item.service.id)}
                    disabled={item.quantity <= MIN_QUANTITY}
                    style={{
                      cursor:
                        item.quantity <= MIN_QUANTITY
                          ? 'not-allowed'
                          : 'pointer',
                      padding: '2px 8px',
                    }}
                  >
                    −
                  </button>{' '}
                  {item.quantity}{' '}
                  <button
                    onClick={() => increaseQuantity(item.service.id)}
                    disabled={item.quantity >= MAX_QUANTITY}
                    style={{
                      cursor:
                        item.quantity >= MAX_QUANTITY
                          ? 'not-allowed'
                          : 'pointer',
                      padding: '2px 8px',
                    }}
                  >
                    +
                  </button>
                </td>
                <td style={{ border: '1px solid #ddd', padding: 10 }}>
                  {(item.service.price * item.quantity).toLocaleString()} ₽
                </td>
                <td style={{ border: '1px solid #ddd', padding: 10 }}>
                  <button
                    onClick={() => removeService(item.service.id)}
                    style={{
                      cursor: 'pointer',
                      padding: '4px 8px',
                      color: '#d33',
                    }}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={3}
                style={{
                  border: '1px solid #ddd',
                  padding: 10,
                  textAlign: 'right',
                }}
              >
                <strong>Итого:</strong>
              </td>
              <td colSpan={2} style={{ border: '1px solid #ddd', padding: 10 }}>
                <strong>{totalPrice.toLocaleString()} ₽</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <p style={{ color: '#888', fontStyle: 'italic' }}>
          Пока не добавлено ни одной услуги
        </p>
      )}
    </div>
  )
}
