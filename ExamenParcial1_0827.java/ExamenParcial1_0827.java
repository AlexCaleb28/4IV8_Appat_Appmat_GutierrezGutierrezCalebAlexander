import java.util.Scanner;

public class ExamenParcial1_0827{
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        boolean continuar = true;

        while (continuar) {
            System.out.println("\n--- Cotización de Piso ---");
            System.out.println("1. Calcular costo");
            System.out.println("2. Salir");
            System.out.print("Elige una opción: ");

            int opcion = sc.nextInt();
            sc.nextLine();

            if (opcion == 1) {
                
                System.out.print("Ingresa el nombre completo del comprador: ");
                String nombre = sc.nextLine();

                
                System.out.print("Ingresa el ancho del piso (metros): ");
                double ancho = sc.nextDouble();

                System.out.print("Ingresa el largo del piso (metros): ");
                double largo = sc.nextDouble();

                double area = ancho * largo;

                
                System.out.println("Selecciona el tipo de piso:");
                System.out.println("1. Porcelanato ($13.45/m²)");
                System.out.println("2. Marmolado ($43.45/m²)");
                System.out.println("3. Acrílico ($39.24/m²)");
                System.out.print("Opción: ");
                int tipo = sc.nextInt();

                double precioM2 = 0;
                switch (tipo) {
                    case 1: precioM2 = 13.45; break;
                    case 2: precioM2 = 43.45; break;
                    case 3: precioM2 = 39.24; break;
                    default:
                        System.out.println("Opción inválida.");
                        continue;
                }

                
                double subtotal = area * precioM2;
                double descuento = subtotal * 0.0725; // 7.25%
                double subtotalConDescuento = subtotal - descuento;
                double impuestos = subtotalConDescuento * 0.16; // IVA 16%
                double total = subtotalConDescuento + impuestos;

                
                System.out.println("\n--- Cotización ---");
                System.out.println("Cliente: " + nombre);
                System.out.println("Área total: " + area + " m²");
                System.out.println("Subtotal: $" + subtotal);
                System.out.println("Descuento (7.25%): -$" + descuento);
                System.out.println("Subtotal con descuento: $" + subtotalConDescuento);
                System.out.println("Impuestos (16%): $" + impuestos);
                System.out.println("TOTAL A PAGAR: $" + total);

            } else if (opcion == 2) {
                continuar = false;
                System.out.println("Saliendo del programa...");
            } else {
                System.out.println("Opción inválida.");
            }
        }

        sc.close();
    }
}
